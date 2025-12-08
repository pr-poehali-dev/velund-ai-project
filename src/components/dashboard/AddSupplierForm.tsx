import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const API_URL = 'https://functions.poehali.dev/b24c5b05-f128-4d2c-9b06-d2e9aed4eddf';

interface AddSupplierFormProps {
  onSuccess: () => void;
}

const AddSupplierForm = ({ onSuccess }: AddSupplierFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    city: '',
    phone: '',
    email: '',
    website_url: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company_name) {
      toast.error('Укажите название компании');
      return;
    }

    setLoading(true);

    const user = localStorage.getItem('velund_user');
    const userData = user ? JSON.parse(user) : null;

    if (!userData?.id) {
      toast.error('Необходимо авторизоваться');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userData.id.toString()
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Ошибка добавления');
        setLoading(false);
        return;
      }

      toast.success('Поставщик добавлен!', {
        description: 'Ожидает модерации администратором'
      });

      setFormData({
        company_name: '',
        city: '',
        phone: '',
        email: '',
        website_url: '',
        description: ''
      });

      onSuccess();
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Icon name="Plus" className="w-6 h-6" />
          Добавить поставщика
        </CardTitle>
        <CardDescription className="text-silver">
          Данные будут проверены администратором перед публикацией
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Название компании *</Label>
            <Input
              placeholder="ООО 'МеталлТрейд'"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="bg-dark border-gold/20 focus:border-gold text-foreground"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Город</Label>
              <Input
                placeholder="Москва"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-dark border-gold/20 focus:border-gold text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Телефон</Label>
              <Input
                placeholder="+7 (495) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-dark border-gold/20 focus:border-gold text-foreground"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <Input
                type="email"
                placeholder="info@metall.ru"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark border-gold/20 focus:border-gold text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Сайт</Label>
              <Input
                placeholder="https://metall.ru"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="bg-dark border-gold/20 focus:border-gold text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Описание</Label>
            <Textarea
              placeholder="Краткое описание компании и ассортимента"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-dark border-gold/20 focus:border-gold text-foreground min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Send" className="w-4 h-4 mr-2" />
                Отправить на модерацию
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSupplierForm;
