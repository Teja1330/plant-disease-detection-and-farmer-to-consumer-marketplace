import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Upload, 
  History, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Calendar, 
  Leaf, 
  Microscope, 
  FileImage, 
  Zap 
} from "lucide-react";

// Simple toast fallback
const useToast = () => {
  const toast = ({ title, description }) => {
    alert(`${title}\n${description}`);
  };
  return { toast };
};

const Detection = () => {
  const { toast } = useToast();

  const [history, setHistory] = useState([]);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      toast({
        title: "Image Uploaded",
        description: `${file.name} is ready for detection`,
      });
    }
  };

  const handleDetect = () => {
    if (!image) {
      toast({
        title: "No Image",
        description: "Please upload an image first",
      });
      return;
    }

    // Mock detection
    const diseases = ["Healthy", "Leaf Spot", "Powdery Mildew", "Rust"];
    const randomResult = diseases[Math.floor(Math.random() * diseases.length)];

    setResult(randomResult);
    setHistory([...history, { image, result: randomResult, date: new Date().toLocaleString() }]);
    toast({
      title: "Detection Complete",
      description: `Detected: ${randomResult}`,
    });
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
            Upload leaf images and detect diseases automatically
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
              <TabsTrigger value="history" className="text-lg">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Detection Tab */}
            <TabsContent value="detection">
              <Card className="max-w-2xl mx-auto shadow-large bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Upload Leaf Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Input type="file" accept="image/*" onChange={handleUpload} />
                  {image && (
                    <div className="mt-4">
                      <img src={image} alt="Uploaded Leaf" className="w-full max-h-64 object-contain rounded-lg" />
                    </div>
                  )}
                  <Button onClick={handleDetect} disabled={!image}>
                    Detect Disease
                  </Button>
                  {result && (
                    <div className="mt-4 p-4 bg-surface rounded-lg flex items-center space-x-2">
                      <Leaf className="h-6 w-6 text-green-600" />
                      <span className="text-lg font-semibold">Result: {result}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.length === 0 && (
                  <p className="text-muted-foreground">No detections yet.</p>
                )}
                {history.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-medium transition-all duration-300 bg-gradient-card">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-surface-soft rounded-t-lg flex items-center justify-center relative">
                          <img src={item.image} alt="Leaf" className="object-contain w-full h-full rounded-t-lg" />
                          <Badge className="absolute top-2 left-2 bg-primary text-white text-xs">
                            {item.result}
                          </Badge>
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="text-sm text-muted-foreground">Date: {item.date}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Detection;
