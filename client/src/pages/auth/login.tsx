import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Metadata } from "@/components/ui/metadata";

const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı gereklidir"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { loginMutation } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await loginMutation.mutateAsync(values);
      toast({
        title: "Giriş başarılı!",
        description: "Yönlendiriliyorsunuz...",
      });
      setLocation("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Giriş başarısız",
        description: "Kullanıcı adı veya şifre hatalı.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent">
      <Metadata 
        title="Giriş Yap"
        description="Güvenli hasta portalına giriş yapın. Randevularınızı yönetin, tedavi sürecinizi takip edin."
        keywords="hasta portal giriş, saç ekimi portal, estetik klinik giriş"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link href="/auth/register">
              <a className="font-medium text-primary hover:text-primary/80">
                Hemen Kaydolun
              </a>
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="kullaniciadi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Link href="/auth/forgot-password">
            <a className="text-sm font-medium text-primary hover:text-primary/80">
              Şifremi Unuttum
            </a>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}