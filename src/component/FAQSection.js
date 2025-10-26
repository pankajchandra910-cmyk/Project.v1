import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export function FAQSection({ title = "Quick Answers", faqs, className = "" }) {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Common questions from travelers (80% coverage)
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-sm pr-2">{faq.question}</span>
                {openItems.includes(index) ? (
                <ChevronUp className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-primary shrink-0" />
              )}
            </button>
            {openItems.includes(index) && (
              <div className="px-4 pb-3 border-t">
                <p className="text-sm text-muted-foreground pt-2">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
