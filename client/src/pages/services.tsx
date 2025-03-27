import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Check, HelpCircle, ArrowRight, ListChecks, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { Service } from "@shared/schema";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const ServiceCard = ({ service }: { service: Service }) => {
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language;
  // Fallback image for services that don't have an image
  const fallbackImage = "/images/services/primehealth1.png";

  // Get the localized service name and description based on current language
  const getLocalizedServiceName = () => {
    if (currentLang === 'tr') return service.name;
    
    const translationKey = `services.serviceItems.${service.id}.name`;
    const translation = t(translationKey);
    
    // Çeviri anahtarının kendisi görünmesini engelle
    if (translation && translation !== translationKey) {
      return translation;
    }
    
    // Sabit çeviriler
    if (service.id === 1) {
      if (currentLang === 'en') return "Hair Transplantation";
      if (currentLang === 'ru') return "Трансплантация волос";
      if (currentLang === 'ka') return "თმის გადანერგვა";
    }
    else if (service.id === 2) {
      if (currentLang === 'en') return "Beard Transplantation";
      if (currentLang === 'ru') return "Пересадка бороды";
      if (currentLang === 'ka') return "წვერის გადანერგვა";
    }
    else if (service.id === 3) {
      if (currentLang === 'en') return "Eyebrow Transplantation";
      if (currentLang === 'ru') return "Пересадка бровей";
      if (currentLang === 'ka') return "წარბების გადანერგვა";
    }
    else if (service.id === 4) {
      if (currentLang === 'en') return "PRP Treatment";
      if (currentLang === 'ru') return "PRP терапия";
      if (currentLang === 'ka') return "PRP თერაპია";
    }
    else if (service.id === 5) {
      if (currentLang === 'en') return "Mesotherapy";
      if (currentLang === 'ru') return "Мезотерапия";
      if (currentLang === 'ka') return "მეზოთერაპია";
    }
    
    return service.name;
  };

  const getLocalizedServiceDescription = () => {
    if (currentLang === 'tr') return service.description;
    
    const translationKey = `services.serviceItems.${service.id}.description`;
    const translation = t(translationKey);
    
    // Çeviri anahtarının kendisi görünmesini engelle
    if (translation && translation !== translationKey) {
      return translation;
    }
    
    // Sabit çeviriler
    if (service.id === 1) {
      if (currentLang === 'en') return "Permanent and natural hair transplantation with Sapphire FUE technique";
      if (currentLang === 'ru') return "Постоянная и естественная трансплантация волос по технике Sapphire FUE";
      if (currentLang === 'ka') return "მუდმივი და ბუნებრივი თმის გადანერგვა Sapphire FUE ტექნიკით";
    }
    else if (service.id === 2) {
      if (currentLang === 'en') return "Permanent and natural beard transplantation solutions";
      if (currentLang === 'ru') return "Постоянные и естественные решения для пересадки бороды";
      if (currentLang === 'ka') return "მუდმივი და ბუნებრივი წვერის გადანერგვის გადაწყვეტილებები";
    }
    else if (service.id === 3) {
      if (currentLang === 'en') return "Natural and permanent eyebrow transplantation procedure";
      if (currentLang === 'ru') return "Естественная и постоянная процедура пересадки бровей";
      if (currentLang === 'ka') return "ბუნებრივი და მუდმივი წარბების გადანერგვის პროცედურა";
    }
    else if (service.id === 4) {
      if (currentLang === 'en') return "Stimulating hair growth with platelets derived from your own blood";
      if (currentLang === 'ru') return "Стимулирование роста волос тромбоцитами из собственной крови";
      if (currentLang === 'ka') return "თმის ზრდის სტიმულირება თქვენი საკუთარი სისხლიდან მიღებული თრომბოციტებით";
    }
    else if (service.id === 5) {
      if (currentLang === 'en') return "Vitamin and mineral injection that nourishes hair follicles";
      if (currentLang === 'ru') return "Инъекция витаминов и минералов, питающая волосяные фолликулы";
      if (currentLang === 'ka') return "ვიტამინებისა და მინერალების ინექცია, რომელიც კვებავს თმის ფოლიკულებს";
    }
    
    return service.description;
  };

  const getLocalizedProcess = (index: number) => {
    const defaultValue = service.process?.[index];
    if (!defaultValue) return '';

    if (currentLang === 'tr') return defaultValue;
    
    // İngilizce, Rusça ve Gürcüce çevirileri için
    const translationKey = `services.serviceItems.${service.id}.process.${index}`;
    const translation = t(translationKey);
    
    // Çeviri anahtarının kendisi görünmesini engelle
    if (translation && translation !== translationKey) {
      return translation;
    }
    
    // Alternatif çeviri yöntemi
    const translatedProcess = t(`services.serviceItems.${service.id}.process`);
    if (translatedProcess && Array.isArray(translatedProcess) && translatedProcess[index]) {
      return translatedProcess[index];
    }
    
    // Sabit çeviriler - Saç ekimi
    if (service.id === 1) {
      if (currentLang === 'en' && index < 5) {
        const process = [
          "Free consultation", "Hair analysis", "Planning", "Graft implantation", "Aftercare"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ru' && index < 5) {
        const process = [
          "Бесплатная консультация", "Анализ волос", "Планирование", "Имплантация графтов", "Послеоперационный уход"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ka' && index < 5) {
        const process = [
          "უფასო კონსულტაცია", "თმის ანალიზი", "დაგეგმვა", "გრაფტების იმპლანტაცია", "შემდგომი მოვლა"
        ];
        return process[index] || defaultValue;
      }
    }
    
    // Sakal ekimi
    if (service.id === 2) {
      if (currentLang === 'en' && index < 5) {
        const process = [
          "Facial analysis", "Beard design", "Local anesthesia", "Graft implantation", "Aftercare"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ru' && index < 5) {
        const process = [
          "Анализ лица", "Дизайн бороды", "Местная анестезия", "Имплантация графтов", "Послеоперационный уход"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ka' && index < 5) {
        const process = [
          "სახის ანალიზი", "წვერის დიზაინი", "ლოკალური ანესთეზია", "გრაფტების იმპლანტაცია", "შემდგომი მოვლა"
        ];
        return process[index] || defaultValue;
      }
    }
    
    // Kaş ekimi
    if (service.id === 3) {
      if (currentLang === 'en' && index < 5) {
        const process = [
          "Eyebrow analysis", "Design", "Local anesthesia", "Precise implantation", "Aftercare recommendations"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ru' && index < 5) {
        const process = [
          "Анализ бровей", "Дизайн", "Местная анестезия", "Точная имплантация", "Рекомендации по уходу"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ka' && index < 5) {
        const process = [
          "წარბების ანალიზი", "დიზაინი", "ლოკალური ანესთეზია", "ზუსტი იმპლანტაცია", "მოვლის რეკომენდაციები"
        ];
        return process[index] || defaultValue;
      }
    }
    
    // PRP Tedavisi
    if (service.id === 4) {
      if (currentLang === 'en' && index < 5) {
        const process = [
          "Blood collection", "PRP preparation", "Scalp cleaning", "PRP injection", "Aftercare instructions"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ru' && index < 5) {
        const process = [
          "Забор крови", "Подготовка PRP", "Очищение кожи головы", "PRP инъекция", "Рекомендации по уходу"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ka' && index < 5) {
        const process = [
          "სისხლის აღება", "PRP-ის მომზადება", "თავის კანის გაწმენდა", "PRP ინექცია", "მოვლის ინსტრუქციები"
        ];
        return process[index] || defaultValue;
      }
    }
    
    // Mezoterapi
    if (service.id === 5) {
      if (currentLang === 'en' && index < 5) {
        const process = [
          "Hair analysis", "Solution preparation", "Scalp cleaning", "Micro injections", "Aftercare advice"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ru' && index < 5) {
        const process = [
          "Анализ волос", "Подготовка раствора", "Очищение кожи головы", "Микроинъекции", "Советы по уходу"
        ];
        return process[index] || defaultValue;
      }
      
      if (currentLang === 'ka' && index < 5) {
        const process = [
          "თმის ანალიზი", "ხსნარის მომზადება", "თავის კანის გაწმენდა", "მიკრო ინექციები", "მოვლის რჩევები"
        ];
        return process[index] || defaultValue;
      }
    }
    
    // Sabit çeviriler - Diğer hizmetler için
    return defaultValue;
  };
  
  const getLocalizedBenefit = (index: number) => {
    const defaultValue = service.benefits?.[index];
    if (!defaultValue) return '';

    if (currentLang === 'tr') return defaultValue;
    
    // İngilizce, Rusça ve Gürcüce çevirileri için
    const translationKey = `services.serviceItems.${service.id}.benefits.${index}`;
    const translation = t(translationKey);
    
    // Çeviri anahtarının kendisi görünmesini engelle
    if (translation && translation !== translationKey) {
      return translation;
    }
    
    // Saç ekimi ve Sakal ekimi için (1, 2)
    if ((service.id === 1 || service.id === 2) && currentLang === 'en' && index < 4) {
      const benefits = [
        "Permanent solution", "Natural appearance", "Minimal scarring", "Quick recovery"
      ];
      return benefits[index] || defaultValue;
    }
    
    if ((service.id === 1 || service.id === 2) && currentLang === 'ru' && index < 4) {
      const benefits = [
        "Постоянное решение", "Естественный вид", "Минимальные следы", "Быстрое восстановление"
      ];
      return benefits[index] || defaultValue;
    }
    
    if ((service.id === 1 || service.id === 2) && currentLang === 'ka' && index < 4) {
      const benefits = [
        "მუდმივი გადაწყვეტა", "ბუნებრივი იერსახე", "მინიმალური კვალი", "სწრაფი აღდგენა"
      ];
      return benefits[index] || defaultValue;
    }
    
    // Kaş ekimi için (3)
    if (service.id === 3 && currentLang === 'en' && index < 4) {
      const benefits = [
        "Fine and precise work", "Permanent result", "Custom design", "Natural appearance"
      ];
      return benefits[index] || defaultValue;
    }
    
    if (service.id === 3 && currentLang === 'ru' && index < 4) {
      const benefits = [
        "Тонкая и точная работа", "Постоянный результат", "Индивидуальный дизайн", "Естественный вид"
      ];
      return benefits[index] || defaultValue;
    }
    
    if (service.id === 3 && currentLang === 'ka' && index < 4) {
      const benefits = [
        "ნატიფი და ზუსტი სამუშაო", "მუდმივი შედეგი", "ინდივიდუალური დიზაინი", "ბუნებრივი იერსახე"
      ];
      return benefits[index] || defaultValue;
    }
    
    // PRP Tedavisi için (4)
    if (service.id === 4 && currentLang === 'en' && index < 4) {
      const benefits = [
        "Natural treatment method", "Quick application", "Minimal side effects", "Painless procedure"
      ];
      return benefits[index] || defaultValue;
    }
    
    if (service.id === 4 && currentLang === 'ru' && index < 4) {
      const benefits = [
        "Естественный метод лечения", "Быстрое применение", "Минимальные побочные эффекты", "Безболезненная процедура"
      ];
      return benefits[index] || defaultValue;
    }
    
    if (service.id === 4 && currentLang === 'ka' && index < 4) {
      const benefits = [
        "ბუნებრივი მკურნალობის მეთოდი", "სწრაფი გამოყენება", "მინიმალური გვერდითი ეფექტები", "უმტკივნეულო პროცედურა"
      ];
      return benefits[index] || defaultValue;
    }
    
    // Mezoterapi için (5)
    if (service.id === 5 && currentLang === 'en' && index < 4) {
      const benefits = [
        "Improved hair quality", "Reduced hair loss", "Strengthened hair follicles", "Natural appearance"
      ];
      return benefits[index] || defaultValue;
    }
    
    if (service.id === 5 && currentLang === 'ru' && index < 4) {
      const benefits = [
        "Улучшение качества волос", "Уменьшение выпадения волос", "Укрепление волосяных фолликулов", "Естественный вид"
      ];
      return benefits[index] || defaultValue;
    }
    
    if (service.id === 5 && currentLang === 'ka' && index < 4) {
      const benefits = [
        "თმის ხარისხის გაუმჯობესება", "თმის ცვენის შემცირება", "თმის ფოლიკულების გაძლიერება", "ბუნებრივი იერსახე"
      ];
      return benefits[index] || defaultValue;
    }
    
    return defaultValue;
  };
  
  const getLocalizedFaq = (faq: string) => {
    if (!faq) return { question: '', answer: '' };
    
    const [question, answer] = faq.split("|");
    
    if (currentLang === 'tr') return { question, answer };
    
    // Try to get translated FAQ
    const faqIndex = service.faqs?.indexOf(faq);
    if (faqIndex !== undefined && faqIndex >= 0) {
      const questionKey = `services.serviceItems.${service.id}.faqs.${faqIndex}.question`;
      const answerKey = `services.serviceItems.${service.id}.faqs.${faqIndex}.answer`;
      
      const translatedQuestion = t(questionKey);
      const translatedAnswer = t(answerKey);
      
      // Çeviri anahtarının kendisi görünmesini engelle
      if (translatedQuestion && translatedQuestion !== questionKey && 
          translatedAnswer && translatedAnswer !== answerKey) {
        return { 
          question: translatedQuestion, 
          answer: translatedAnswer 
        };
      }
    }
    
    // Saç ekimi için sabit çeviriler
    if (service.id === 1 && faqIndex !== undefined) {
      if (currentLang === 'en') {
        if (faqIndex === 0) {
          return {
            question: "Is hair transplantation permanent?",
            answer: "Yes, it is a lifelong solution."
          };
        } else if (faqIndex === 1) {
          return {
            question: "How long does the procedure take?",
            answer: "It takes about 6-8 hours on average."
          };
        }
      } else if (currentLang === 'ru') {
        if (faqIndex === 0) {
          return {
            question: "Трансплантация волос - это навсегда?",
            answer: "Да, это пожизненное решение."
          };
        } else if (faqIndex === 1) {
          return {
            question: "Сколько длится процедура?",
            answer: "В среднем 6-8 часов."
          };
        }
      } else if (currentLang === 'ka') {
        if (faqIndex === 0) {
          return {
            question: "არის თუ არა თმის გადანერგვა მუდმივი?",
            answer: "დიახ, ეს არის სამუდამო გადაწყვეტილება."
          };
        } else if (faqIndex === 1) {
          return {
            question: "რამდენ ხანს გრძელდება პროცედურა?",
            answer: "საშუალოდ 6-8 საათი."
          };
        }
      }
    }
    
    // Sakal ekimi için sabit çeviriler
    if (service.id === 2 && faqIndex !== undefined) {
      if (currentLang === 'en') {
        if (faqIndex === 0) {
          return {
            question: "Is beard transplantation permanent?",
            answer: "Yes, it is a lifelong solution."
          };
        } else if (faqIndex === 1) {
          return {
            question: "How long does the procedure take?",
            answer: "On average 3-4 hours."
          };
        } else if (faqIndex === 2) {
          return {
            question: "When can I shave?",
            answer: "You can shave 15 days after the procedure."
          };
        }
      } else if (currentLang === 'ru') {
        if (faqIndex === 0) {
          return {
            question: "Пересадка бороды - это навсегда?",
            answer: "Да, это пожизненное решение."
          };
        } else if (faqIndex === 1) {
          return {
            question: "Сколько длится процедура?",
            answer: "В среднем 3-4 часа."
          };
        } else if (faqIndex === 2) {
          return {
            question: "Когда я смогу бриться?",
            answer: "Вы можете бриться через 15 дней после процедуры."
          };
        }
      } else if (currentLang === 'ka') {
        if (faqIndex === 0) {
          return {
            question: "არის თუ არა წვერის გადანერგვა მუდმივი?",
            answer: "დიახ, ეს არის სამუდამო გადაწყვეტილება."
          };
        } else if (faqIndex === 1) {
          return {
            question: "რამდენ ხანს გრძელდება პროცედურა?",
            answer: "საშუალოდ 3-4 საათი."
          };
        } else if (faqIndex === 2) {
          return {
            question: "როდის შემიძლია გაპარსვა?",
            answer: "შეგიძლიათ გაიპარსოთ პროცედურიდან 15 დღის შემდეგ."
          };
        }
      }
    }
    
    // Kaş ekimi için sabit çeviriler
    if (service.id === 3 && faqIndex !== undefined) {
      if (currentLang === 'en') {
        if (faqIndex === 0) {
          return {
            question: "When will the result be visible?",
            answer: "Your new eyebrows will start growing within 3-4 months."
          };
        } else if (faqIndex === 1) {
          return {
            question: "Will it look natural?",
            answer: "Yes, the result will be harmonious with your existing eyebrows and look natural."
          };
        } else if (faqIndex === 2) {
          return {
            question: "How should I care for it?",
            answer: "You will need to follow special care instructions during the first week."
          };
        }
      } else if (currentLang === 'ru') {
        if (faqIndex === 0) {
          return {
            question: "Когда будет виден результат?",
            answer: "Новые брови начнут расти через 3-4 месяца."
          };
        } else if (faqIndex === 1) {
          return {
            question: "Будет ли выглядеть естественно?",
            answer: "Да, результат будет гармонировать с существующими бровями и выглядеть естественно."
          };
        } else if (faqIndex === 2) {
          return {
            question: "Как ухаживать?",
            answer: "В течение первой недели необходимо следовать особым инструкциям по уходу."
          };
        }
      } else if (currentLang === 'ka') {
        if (faqIndex === 0) {
          return {
            question: "როდის იქნება შედეგი ხილული?",
            answer: "თქვენი ახალი წარბები დაიწყებს ზრდას 3-4 თვის განმავლობაში."
          };
        } else if (faqIndex === 1) {
          return {
            question: "ბუნებრივად გამოიყურება?",
            answer: "დიახ, შედეგი იქნება ჰარმონიული თქვენს არსებულ წარბებთან და გამოიყურება ბუნებრივად."
          };
        } else if (faqIndex === 2) {
          return {
            question: "როგორ უნდა მოვუაროთ?",
            answer: "პირველი კვირის განმავლობაში საჭიროა მოვლის სპეციალური ინსტრუქციების დაცვა."
          };
        }
      }
    }
    
    // PRP Tedavisi için sabit çeviriler
    if (service.id === 4 && faqIndex !== undefined) {
      if (currentLang === 'en') {
        if (faqIndex === 0) {
          return {
            question: "How often should PRP treatment be done?",
            answer: "Usually 4-6 sessions are recommended, 3-4 weeks apart."
          };
        } else if (faqIndex === 1) {
          return {
            question: "When will results be visible?",
            answer: "You will start seeing the first results within 2-3 months."
          };
        } else if (faqIndex === 2) {
          return {
            question: "Return to daily life after the procedure?",
            answer: "You can return to your daily life immediately after the procedure."
          };
        }
      } else if (currentLang === 'ru') {
        if (faqIndex === 0) {
          return {
            question: "Как часто следует проводить PRP терапию?",
            answer: "Обычно рекомендуется 4-6 сеансов с интервалом 3-4 недели."
          };
        } else if (faqIndex === 1) {
          return {
            question: "Когда будут видны результаты?",
            answer: "Первые результаты вы начнете видеть через 2-3 месяца."
          };
        } else if (faqIndex === 2) {
          return {
            question: "Возвращение к повседневной жизни после процедуры?",
            answer: "Вы можете вернуться к повседневной жизни сразу после процедуры."
          };
        }
      } else if (currentLang === 'ka') {
        if (faqIndex === 0) {
          return {
            question: "რამდენად ხშირად უნდა ჩატარდეს PRP მკურნალობა?",
            answer: "ჩვეულებრივ რეკომენდებულია 4-6 სეანსი, 3-4 კვირის ინტერვალით."
          };
        } else if (faqIndex === 1) {
          return {
            question: "როდის იქნება შედეგები ხილული?",
            answer: "პირველ შედეგებს 2-3 თვეში დაიწყებთ."
          };
        } else if (faqIndex === 2) {
          return {
            question: "ყოველდღიურ ცხოვრებაში დაბრუნება პროცედურის შემდეგ?",
            answer: "შეგიძლიათ დაუბრუნდეთ ყოველდღიურ ცხოვრებას პროცედურის დასრულებისთანავე."
          };
        }
      }
    }
    
    // Mezoterapi için sabit çeviriler
    if (service.id === 5 && faqIndex !== undefined) {
      if (currentLang === 'en') {
        if (faqIndex === 0) {
          return {
            question: "How many sessions are needed?",
            answer: "Usually 4-6 sessions are recommended, applied 2-3 weeks apart."
          };
        } else if (faqIndex === 1) {
          return {
            question: "Is the procedure painful?",
            answer: "A minimum level of discomfort is felt."
          };
        } else if (faqIndex === 2) {
          return {
            question: "When will I get results?",
            answer: "You will start seeing the first results after 2-3 sessions."
          };
        }
      } else if (currentLang === 'ru') {
        if (faqIndex === 0) {
          return {
            question: "Сколько сеансов необходимо?",
            answer: "Обычно рекомендуется 4-6 сеансов, применяемых с интервалом 2-3 недели."
          };
        } else if (faqIndex === 1) {
          return {
            question: "Процедура болезненна?",
            answer: "Ощущается минимальный дискомфорт."
          };
        } else if (faqIndex === 2) {
          return {
            question: "Когда я получу результаты?",
            answer: "Вы начнете видеть первые результаты после 2-3 сеансов."
          };
        }
      } else if (currentLang === 'ka') {
        if (faqIndex === 0) {
          return {
            question: "რამდენი სეანსია საჭირო?",
            answer: "ჩვეულებრივ რეკომენდებულია 4-6 სეანსი, გამოყენებული 2-3 კვირის ინტერვალით."
          };
        } else if (faqIndex === 1) {
          return {
            question: "არის პროცედურა მტკივნეული?",
            answer: "იგრძნობა მინიმალური დისკომფორტი."
          };
        } else if (faqIndex === 2) {
          return {
            question: "როდის მივიღებ შედეგებს?",
            answer: "პირველი შედეგების დანახვას 2-3 სეანსის შემდეგ დაიწყებთ."
          };
        }
      }
    }
    
    return { question, answer };
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={service.imageUrl || fallbackImage}
          alt={getLocalizedServiceName()}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white/90 hover:bg-white"
            asChild
          >
            <Link href={`/randevu?service=${service.slug}`}>
              {t('buttons.appointment')}
            </Link>
          </Button>
        </div>
      </div>

      <CardHeader className="flex-grow">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          {getLocalizedServiceName()}
          <span className="flex items-center text-sm font-normal text-primary">
            <Clock className="h-4 w-4 mr-1" />
            {service.duration}
          </span>
        </CardTitle>
        <p className="text-gray-600 text-sm mt-2">{getLocalizedServiceDescription()}</p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="details" className="text-xs">
              <Info className="h-3 w-3 mr-1" /> {t('services.tabs.details')}
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-xs">
              <Check className="h-3 w-3 mr-1" /> {t('services.tabs.benefits')}
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-xs">
              <HelpCircle className="h-3 w-3 mr-1" /> {t('services.tabs.faq')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                {t('services.processTitle')}
              </h3>
              <ol className="space-y-1 text-sm">
                {service.process?.slice(0, 4).map((step, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-600">{getLocalizedProcess(idx)}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="mt-2">
            <motion.ul 
              className="grid grid-cols-1 gap-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {service.benefits?.slice(0, 4).map((benefit, idx) => (
                <motion.li
                  key={idx}
                  variants={item}
                  className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50"
                >
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{getLocalizedBenefit(idx)}</span>
                </motion.li>
              ))}
            </motion.ul>
          </TabsContent>

          <TabsContent value="faq" className="mt-2">
            <Accordion type="single" collapsible>
              {service.faqs?.slice(0, 3).map((faq, idx) => {
                const localizedFaq = getLocalizedFaq(faq);
                return (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`}
                    className="border-b last:border-0"
                  >
                    <AccordionTrigger className="text-sm hover:text-primary transition-colors">
                      {localizedFaq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      {localizedFaq.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t">
          <Button 
            size="sm"
            className="w-full group hover:translate-y-[-1px] transition-all duration-300"
            asChild
          >
            <Link href="/iletisim">
              <span>{t('services.freeConsultation')}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Services() {
  const { t } = useTranslation('common');
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div className="min-h-screen">
      <Metadata
        title={t('services.metaTitle')}
        description={t('services.metaDescription')}
        keywords={t('services.metaKeywords')}
        type="website"
        image="/images/services/sapphire-fue.jpg"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -right-40 -top-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -left-40 -bottom-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {t('services.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('services.description')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services?.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                className="group"
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}