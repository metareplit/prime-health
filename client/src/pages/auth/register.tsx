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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { UserRole, Gender } from "@shared/schema";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const registerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  dateOfBirth: z.string().min(1, "Doğum tarihi gereklidir"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Lütfen cinsiyet seçiniz",
  }),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      // Telefon numarası minimum uzunluk kontrolü
      if (values.phone.length < 8) {
        toast({
          title: "Hata",
          description: "Geçersiz telefon numarası formatı",
          variant: "destructive",
        });
        return;
      }

      const res = await apiRequest("POST", "/api/auth/register", {
        ...values,
        dateOfBirth: new Date(values.dateOfBirth),
        role: UserRole.PATIENT
      });

      if (res.ok) {
        toast({
          title: "Kayıt başarılı!",
          description: "Hasta portalına giriş yapabilirsiniz.",
        });
        setLocation("/auth/login");
      } else {
        const error = await res.json();
        toast({
          variant: "destructive",
          title: "Kayıt başarısız",
          description: error.message || "Kayıt sırasında bir hata oluştu.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Kayıt başarısız",
        description: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Hasta Kaydı</h2>
          <p className="mt-2 text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/login">
              <a className="font-medium text-primary hover:text-primary/80">
                Giriş Yapın
              </a>
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input placeholder="Adınız" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Soyadınız" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ornek@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <PhoneInput
                      specialLabel=""
                      enableSearch
                      searchPlaceholder="Ülke ara..."
                      searchNotFound="Ülke bulunamadı"
                      value={field.value}
                      onChange={phone => field.onChange(phone)}
                      inputStyle={{
                        width: '100%',
                        height: '40px',
                        fontSize: '16px',
                        paddingLeft: '48px'
                      }}
                      containerStyle={{
                        width: '100%'
                      }}
                      buttonStyle={{
                        backgroundColor: 'transparent',
                        borderRadius: '6px 0 0 6px',
                        border: '1px solid #e2e8f0',
                        borderRight: 'none'
                      }}
                      dropdownStyle={{
                        width: '300px'
                      }}
                      placeholder="(555) 555-5555"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doğum Tarihi</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} max={new Date().toISOString().split('T')[0]} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cinsiyet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Erkek</SelectItem>
                        <SelectItem value="female">Kadın</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <Button type="submit" className="w-full">
              Hasta Kaydı Oluştur
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}