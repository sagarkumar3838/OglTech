import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HTML5QuestionService, HTML5_FEATURES } from '@/services/html5QuestionService';

export default function HTML5Practice() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      // Select first 5 features as example
      const features = HTML5_FEATURES.slice(0, 5).map(f => f.name);
      
      const result = await HTML5QuestionService.generateQuestions(
        features,
        'BASIC',
        2, // 2 questions per feature
        true // use AI
      );
      
      setQuestions(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">HTML5 Features Practice</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {HTML5_FEATURES.map((feature) => (
            <div key={feature.name} className="text-sm">
              • {feature.name}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleGenerateQuestions}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </Button>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((featureData, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {featureData.feature}
              </h3>
              {featureData.questions.map((q: any, qIdx: number) => (
                <div key={qIdx} className="mb-4">
                  <p className="font-medium mb-2">{q.question}</p>
                  {q.options && (
                    <div className="space-y-1 ml-4">
                      {q.options.map((opt: string, oIdx: number) => (
                        <div key={oIdx}>{opt}</div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-green-600 mt-2">
                    Answer: {q.correct_answer}
                  </p>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
