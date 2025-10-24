// Detection.jsx - Complete updated version
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Upload,
  History,
  Leaf,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleScroll } from "@/components/Navbar";
import { plantDetectionAPI } from "@/api";

const Detection = () => {
  useEffect(() => {
    handleScroll();
  }, []);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  const { toast } = useToast();
  const [history, setHistory] = useState([]);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file));
      toast({
        title: "Image Uploaded",
        description: `${file.name} is ready for detection`,
      });
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await plantDetectionAPI.detect(selectedFile);
      const detectionResult = response.data;

      setResult(detectionResult);

      // Update history immediately
      const newHistoryItem = {
        id: detectionResult.id,
        image: detectionResult.image_url || image,
        result: detectionResult.prediction,
        confidence: detectionResult.confidence,
        date: new Date(detectionResult.created_at).toLocaleString(),
        top_predictions: detectionResult.top_predictions || []
      };

      setHistory([newHistoryItem, ...history]);

      toast({
        title: "Detection Complete",
        description: `Detected: ${detectionResult.prediction} (${(detectionResult.confidence * 100).toFixed(2)}% confidence)`,
        variant: "success"
      });

    } catch (error) {
      console.error("Detection error:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      console.log("🔄 Loading history...");
      const response = await plantDetectionAPI.getHistory();
      console.log("📦 History API response:", response.data);

      const historyData = response.data.map(item => {
        // Fix image URL - convert relative path to absolute URL
        let imageUrl = item.image_url;
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = `${API_BASE_URL}${imageUrl}`;
        }

        console.log("📷 History item:", {
          id: item.id,
          original_url: item.image_url,
          fixed_url: imageUrl
        });

        return {
          id: item.id,
          image: imageUrl, // Use the fixed absolute URL
          result: item.prediction,
          confidence: item.confidence,
          date: new Date(item.created_at).toLocaleString(),
          top_predictions: item.top_predictions || []
        };
      });

      console.log("🎯 Processed history data:", historyData);
      setHistory(historyData);

    } catch (error) {
      console.error("❌ Failed to load history:", error);
      console.error("Error details:", error.response?.data);
      toast({
        title: "Failed to load history",
        description: error.response?.data?.detail || "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleDeleteHistory = async (detectionId = null) => {
    try {
      setDeletingId(detectionId);
      await plantDetectionAPI.deleteHistory(detectionId);

      if (detectionId) {
        // Delete single item
        setHistory(history.filter(item => item.id !== detectionId));
        toast({
          title: "Deleted",
          description: "Detection removed from history",
          variant: "success"
        });
      } else {
        // Delete all
        setHistory([]);
        toast({
          title: "History Cleared",
          description: "All detection history has been cleared",
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete history",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleError = (error) => {
    if (error.response?.status === 401) {
      toast({
        title: "Session Expired",
        description: "Please login again",
        variant: "destructive"
      });
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast({
        title: "Access Denied",
        description: error.response?.data?.detail || "You don't have permission to use this feature",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Detection Failed",
        description: error.response?.data?.detail || "Failed to process image",
        variant: "destructive"
      });
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceVariant = (confidence) => {
    if (confidence > 0.8) return 'default';
    if (confidence > 0.6) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground">Crop Disease Detection</h1>
          <p className="text-lg text-muted-foreground">
            Upload leaf images and detect diseases automatically using AI
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Tabs defaultValue="detection" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="detection" className="text-lg">
                <Camera className="h-4 w-4 mr-2" />
                Detection
              </TabsTrigger>
              <TabsTrigger value="history" className="text-lg" onClick={loadHistory}>
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Detection Tab */}
            <TabsContent value="detection">
              <Card className="max-w-2xl mx-auto shadow-large bg-white border">
                <CardHeader>
                  <CardTitle className="text-2xl">Upload Leaf Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={loading}
                  />

                  {image && (
                    <div className="mt-4">
                      <img src={image} alt="Uploaded Leaf" className="w-full max-h-64 object-contain rounded-lg border" />
                    </div>
                  )}

                  <Button
                    onClick={handleDetect}
                    disabled={!selectedFile || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Detecting...
                      </>
                    ) : (
                      "Detect Disease"
                    )}
                  </Button>

                  {result && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Leaf className="h-6 w-6 text-green-600" />
                        <span className="text-lg font-semibold text-green-800">
                          Prediction: {result.prediction}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                          {(result.confidence * 100).toFixed(2)}%
                        </span>
                      </div>

                      {/* Top Predictions - Only show if there are multiple meaningful ones */}
                      {result.top_predictions && result.top_predictions.length > 1 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Other Possibilities:</h4>
                          <div className="space-y-1">
                            {result.top_predictions.slice(1).map(([pred, conf], index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">
                                  {index + 1}. {pred}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {(conf * 100).toFixed(1)}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Detection History</h3>
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteHistory()}
                    disabled={deletingId === 'all'}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    {deletingId === 'all' ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2"></div>
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">No detection history yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload and detect images to see them here.
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className="hover:shadow-medium transition-all duration-300 bg-white border group">
                        <CardContent className="p-0">
                          <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center relative">
                            <img
                              src={item.image}
                              alt="Detection result"
                              className="object-contain w-full h-full rounded-t-lg"
                              onError={(e) => {
                                // If image fails to load, show a placeholder
                                console.error(`Failed to load image: ${item.image}`);
                                e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                                e.target.alt = 'Image failed to load';
                              }}
                              onLoad={() => console.log(`Image loaded: ${item.image}`)}
                            />
                            <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
                              {item.result}
                            </Badge>
                            <Badge
                              variant={getConfidenceVariant(item.confidence)}
                              className="absolute top-2 right-2 text-xs"
                            >
                              {(item.confidence * 100).toFixed(1)}%
                            </Badge>

                            {/* Delete Button */}
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteHistory(item.id)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <div className="p-4 space-y-2">
                            <p className="text-sm text-muted-foreground">Detected: {item.result}</p>
                            <p className="text-sm text-muted-foreground">Date: {item.date}</p>

                            {/* Top Predictions in History - Only show if there are multiple meaningful ones */}
                            {item.top_predictions && item.top_predictions.length > 1 && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs font-medium text-gray-500 mb-1">Other Possibilities:</p>
                                <div className="space-y-1">
                                  {item.top_predictions.slice(1, 3).map(([pred, conf], index) => (
                                    <div key={index} className="flex justify-between items-center text-xs">
                                      <span className="text-gray-500">
                                        {index + 1}. {pred}
                                      </span>
                                      <span className="text-gray-400">{(conf * 100).toFixed(1)}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Detection;