import { useState } from "react";
import { X, Mail, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { sendBlueprintEmail, sendAdminNotification } from "@/lib/blueprintEmail";



export default function EmailResultsModal({ business, draft, branches, stages, objectives, onClose }) {
  const { toast } = useToast();
  const [email, setEmail] = useState(business?.created_by || "");
  const [clientName, setClientName] = useState(business?.business_name || "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);



  const handleSend = async () => {
    if (!email) return;
    setSending(true);
    await sendBlueprintEmail({ toEmail: email, business, draft, branches, stages });
    if (draft?.payment_status === "paid") {
      await sendAdminNotification({ business, draft, clientEmail: email });
    }
    setSending(false);
    setSent(true);
    toast({ title: "Blueprint sent!", description: `Results emailed to ${email}` });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-lg">Email Blueprint Results</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Blueprint Sent!</h3>
            <p className="text-muted-foreground text-sm">Your complete marketing blueprint has been emailed to {email}</p>
            <Button className="mt-6 w-full" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Send the complete marketing blueprint including channels, customer journey, allocations, and weekly plan to any email address.
            </p>
            <div className="space-y-1.5">
              <Label>Client / Recipient Email</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p>✓ Full channel details with purpose, objective, metrics</p>
              <p>✓ Customer journey map with all stages</p>
              <p>✓ Time & cost allocation table</p>
              <p>✓ Weekly review framework</p>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleSend}
              disabled={sending || !email}
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Sending..." : "Send Blueprint"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}