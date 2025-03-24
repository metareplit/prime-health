import { useMutation } from "@tanstack/react-query";
import { sendSMS } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function useNotifications() {
  const { toast } = useToast();
  const { t } = useTranslation('common');

  const sendSMSMutation = useMutation({
    mutationFn: sendSMS,
    onSuccess: () => {
      toast({
        title: t('appointment.book.success'),
        description: t('appointment.book.confirmation'),
      });
    },
    onError: () => {
      toast({
        title: t('appointment.book.error'),
        description: t('forms.contact.error'),
        variant: "destructive",
      });
    },
  });

  return {
    sendSMSMutation
  };
}
