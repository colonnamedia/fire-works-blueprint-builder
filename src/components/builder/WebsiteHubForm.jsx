import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WebsiteHubForm({ business, onChange }) {
  const toggle = (name, label, desc) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch checked={!!business[name]} onCheckedChange={(v) => onChange(name, v)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Website / Hub</h2>
        <p className="text-sm text-muted-foreground">
          Your website acts as your digital storefront — the central hub of your marketing system
        </p>
      </div>

      {toggle("has_website", "Do you have a website?", "Your main online presence")}

      {business.has_website && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Website URL</Label>
          <Input
            value={business.website_url || ""}
            onChange={(e) => onChange("website_url", e.target.value)}
            placeholder="https://yourbusiness.com"
          />
        </div>
      )}

      {toggle("needs_landing_page", "Need a landing page?", "A focused page for specific campaigns")}
      {toggle("has_booking_form", "Has booking/appointment form?", "Online scheduling capability")}
      {toggle("has_lead_form", "Has lead capture form?", "Contact or inquiry form")}
      {toggle("has_email_capture", "Has email capture?", "Newsletter signup or lead magnet")}
      {toggle("has_crm", "Uses a CRM?", "Customer relationship management tool")}
      {toggle("has_online_checkout", "Has online checkout?", "E-commerce or payment processing")}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Conversion Strength</Label>
          <Select value={business.conversion_strength || "moderate"} onValueChange={(v) => onChange("conversion_strength", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="weak">Weak — Few visitors convert</SelectItem>
              <SelectItem value="moderate">Moderate — Some convert</SelectItem>
              <SelectItem value="strong">Strong — Good conversion rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Lead Response Speed</Label>
          <Select value={business.lead_response_speed || "moderate"} onValueChange={(v) => onChange("lead_response_speed", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow — Days to respond</SelectItem>
              <SelectItem value="moderate">Moderate — Within 24 hours</SelectItem>
              <SelectItem value="fast">Fast — Within 1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}