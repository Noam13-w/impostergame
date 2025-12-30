import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-4">אופס! משהו השתבש</h2>
        
        <div className="bg-red-900/30 rounded-2xl p-4 border border-red-500/30 mb-6">
          <p className="text-red-300 text-sm">
            {error || 'שגיאה לא ידועה'}
          </p>
        </div>

        <Button
          onClick={onRetry}
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-2xl"
        >
          <RotateCcw className="w-5 h-5 ml-2" />
          נסה שוב
        </Button>
      </motion.div>
    </div>
  );
}