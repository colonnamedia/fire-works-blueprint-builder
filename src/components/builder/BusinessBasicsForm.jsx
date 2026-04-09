import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function BusinessBasicsForm({ business, onChange }) {
  const field = (name, label, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {type === "textarea" ? (
        <Textarea
          value={business[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : type === "number" ? (
        <Input
          type="number"
          value={business[name] || ""}
          onChange={(e) => onChange(name, parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
        />
      ) : (
        <Input
          value={business[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Business Basics</h2>
        <p className="text-sm text-muted-foreground">Tell us about your business to build the right foundation</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {field("business_name", "Business Name", "text", "Acme Marketing Co.")}
        {field("business_type", "Business Type", "text", "Service, Product, SaaS, etc.")}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Storefront Type</Label>
        <Select value={business.storefront_type} onValueChange={(v) => onChange("storefront_type", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="non-storefront">Non-Storefront (Online Only)</SelectItem>
            <SelectItem value="storefront">Storefront (Physical Location)</SelectItem>
            <SelectItem value="hybrid">Hybrid (Physical + Online)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          This determines your center hub: {business.storefront_type === "storefront" ? "Storefront + Website" : business.storefront_type === "hybrid" ? "Physical Location + Website" : "Website / Digital Storefront"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {field("industry", "Industry", "text", "Healthcare, Retail, Tech, etc.")}
        {field("service_area", "Service Area", "text", "City, State, National, etc.")}
      </div>

      {field("main_offer", "Main Offer / Product", "text", "What do you sell or provide?")}
      {field("secondary_offer", "Secondary Offer", "text", "Any additional services or products?")}
      {field("target_audience", "Target Audience", "textarea", "Describe your ideal customer")}

      <div className="grid sm:grid-cols-2 gap-4">
        {field("average_ticket_value", "Average Ticket Value ($)", "number", "100")}
        {field("main_goal", "Main Business Goal", "text", "More leads, more sales, better retention...")}
      </div>
      {field("secondary_goal", "Secondary Goal", "text", "Optional secondary objective")}
    </div>
  );
}