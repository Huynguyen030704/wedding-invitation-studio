import { Heart } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="py-12 md:py-16 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl text-gradient-gold mb-4">
          Minh Anh & Hoàng Nam
        </h2>
        
        <p className="font-body text-muted-foreground mb-8">
          20.02.2025
        </p>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <span className="font-body text-sm">Made with</span>
          <Heart className="w-4 h-4 text-rose fill-rose animate-heartbeat" />
          <span className="font-body text-sm">for our special day</span>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="font-body text-sm text-muted-foreground">
            © 2025 Wedding Invitation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
