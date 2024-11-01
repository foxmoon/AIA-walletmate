import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Loader2 } from "lucide-react";

interface AdvisorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: string;
  advisorType: string;
  t: (key: string) => string;
  loading: boolean;
}

export function AdvisorDialog({ open, onOpenChange, suggestion, advisorType, t, loading }: AdvisorDialogProps) {
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(suggestion, 10, 10);
    doc.save(`${t(`advisor.${advisorType}.name`)}-建议.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-background/95 backdrop-blur-sm z-50">
        <DialogHeader>
          <DialogTitle>{t(`advisor.${advisorType}.name`)}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto mt-4 p-4">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm text-muted-foreground">
                {t('advisor.generating')}
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto">
              <ReactMarkdown>{suggestion}</ReactMarkdown>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={exportToPDF} disabled={loading}>
            导出建议
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 