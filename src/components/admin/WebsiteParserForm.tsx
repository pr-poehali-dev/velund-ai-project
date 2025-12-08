import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const WebsiteParserForm = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleParse = async () => {
    if (!url) {
      toast.error('Введите URL сайта');
      return;
    }

    setLoading(true);
    setResult(null);

    toast.info('Функция в разработке', {
      description: 'Пока используйте ручное добавление поставщиков через форму ниже'
    });

    setTimeout(() => {
      setLoading(false);
      const mockResult = {
        company_name: 'Демо Компания',
        city: 'Москва',
        phone: '+7 (495) 123-45-67',
        email: 'info@example.ru',
        products_added: 0
      };
      setResult(mockResult);
      toast.warning('Демо-режим', {
        description: 'Для полноценной работы парсера требуется дополнительный функционал'
      });
    }, 2000);
  };

  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Icon name="Globe" className="w-6 h-6" />
          AI Парсер сайтов
        </CardTitle>
        <CardDescription className="text-silver">
          Вставьте URL сайта поставщика - AI автоматически извлечет контакты и товары
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground">URL сайта</Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-dark border-gold/20 focus:border-gold text-foreground"
              disabled={loading}
            />
            <Button
              onClick={handleParse}
              className="bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Парсим...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" className="w-4 h-4 mr-2" />
                  Парсить
                </>
              )}
            </Button>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-dark rounded-lg border border-green-500/20 space-y-2 animate-fade-in">
            <h4 className="text-green-500 font-semibold flex items-center gap-2">
              <Icon name="CheckCircle" className="w-5 h-5" />
              Данные извлечены
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-silver">Компания:</span>
                <p className="text-foreground font-medium">{result.company_name}</p>
              </div>
              <div>
                <span className="text-silver">Город:</span>
                <p className="text-foreground font-medium">{result.city}</p>
              </div>
              <div>
                <span className="text-silver">Телефон:</span>
                <p className="text-foreground font-medium">{result.phone}</p>
              </div>
              <div>
                <span className="text-silver">Email:</span>
                <p className="text-foreground font-medium">{result.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-green-500/20">
              <span className="text-silver">Товаров добавлено:</span>
              <p className="text-gold font-bold text-lg">{result.products_added}</p>
            </div>
          </div>
        )}

        <div className="p-3 bg-dark rounded-lg border border-gold/10 text-sm text-silver">
          <p className="flex items-start gap-2">
            <Icon name="Info" className="w-4 h-4 mt-0.5" />
            <span>
              AI автоматически извлечет название компании, контакты, товары и цены. 
              Все данные сразу добавятся в базу и станут доступны в поиске.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteParserForm;