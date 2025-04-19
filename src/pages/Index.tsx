
import { useState } from "react";
import AlgorithmVisualizer from "@/components/AlgorithmVisualizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-3">
            Algorithm Visualizer
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Watch sorting and searching algorithms in action with real-time animations
          </p>
        </header>
        
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <AlgorithmVisualizer />
          </CardContent>
        </Card>
        
        <footer className="mt-10 text-center text-sm text-slate-500">
          <p>Interactive visualization of popular algorithms</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
