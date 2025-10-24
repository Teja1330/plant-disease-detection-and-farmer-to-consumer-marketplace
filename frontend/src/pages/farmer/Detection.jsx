// Detection.jsx - Simplified version
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
  Leaf
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleScroll } from "@/components/Navbar";
import { plantDetectionAPI } from "@/api";

const Detection = () => {
  useEffect(() => {
    handleScroll();
  }, []);

  const { toast } = useToast();
  const [history, setHistory] = useState([]);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  // Detection.jsx - Fix error handling
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

      // Update history
      const newHistoryItem = {
        image: image,
        result: detectionResult.prediction,
        confidence: detectionResult.confidence,
        date: new Date().toLocaleString()
      };

      setHistory([newHistoryItem, ...history]);

      toast({
        title: "Detection Complete",
        description: `Detected: ${detectionResult.prediction} (${(detectionResult.confidence * 100).toFixed(2)}% confidence)`,
        variant: "success"
      });

    } catch (error) {
      console.error("Detection error:", error);

      // Don't logout automatically for 403 errors
      if (error.response?.status === 401) {
        // Only logout for 401 (Unauthorized)
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive"
        });
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        // For 403, show access denied but don't logout
        toast({
          title: "Access Denied",
          description: error.response?.data?.detail || "You don't have permission to use this feature",
          variant: "destructive"
        });
      } else {
        // Other errors (network, server, etc.)
        toast({
          title: "Detection Failed",
          description: error.response?.data?.detail || "Failed to process image",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await plantDetectionAPI.getHistory();
      setHistory(response.data.map(item => ({
        image: item.image,
        result: item.prediction,
        confidence: item.confidence,
        date: new Date(item.created_at).toLocaleString()
      })));
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
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
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                          {(result.confidence * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.length === 0 ? (
                  <p className="text-muted-foreground col-span-full text-center py-8">No detection history yet.</p>
                ) : (
                  history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-medium transition-all duration-300 bg-white border">
                        <CardContent className="p-0">
                          <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center relative">
                            <img
                              src={item.image}
                              alt="Detection result"
                              className="object-contain w-full h-full rounded-t-lg"
                            />
                            <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
                              {item.result}
                            </Badge>
                            <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs">
                              {(item.confidence * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="p-4 space-y-2">
                            <p className="text-sm text-muted-foreground">Detected: {item.result}</p>
                            <p className="text-sm text-muted-foreground">Date: {item.date}</p>
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