import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planType = searchParams.get('plan') || 'month';
  
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const plans = {
    month: {
      name: 'Месяц Безлимит',
      price: 1200,
      duration: '30 дней',
      icon: 'Calendar',
      features: [
        'Неограниченные AI запросы',
        'Загрузка своих прайсов',
        'Экспорт данных',
        'Уведомления о ценах',
        'Приоритетная поддержка'
      ]
    },
    day: {
      name: 'День Безлимит',
      price: 150,
      duration: '24 часа',
      icon: 'Clock',
      features: [
        '24 часа полного доступа',
        'Все функции Premium',
        'Идеально для разовых задач'
      ]
    }
  };

  const selectedPlan = plans[planType as keyof typeof plans];
  const cardNumber = '2200 7007 1234 5678';

  useEffect(() => {
    if (!selectedPlan) {
      navigate('/');
    }
  }, [selectedPlan, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 5 МБ');
        return;
      }
      
      setReceiptFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!receiptFile) {
      alert('Пожалуйста, загрузите чек об оплате');
      return;
    }

    setUploading(true);
    
    // TODO: Implement actual upload to backend
    setTimeout(() => {
      setUploading(false);
      alert('Чек отправлен на модерацию! Вы получите уведомление после проверки администратором.');
      navigate('/profile');
    }, 2000);
  };

  if (!selectedPlan) return null;

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-border bg-dark-lighter/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold via-gold-light to-silver rounded-lg flex items-center justify-center">
                <Icon name="Hammer" className="w-6 h-6 text-dark" />
              </div>
              <h1 className="text-2xl font-bold font-montserrat text-gradient-gold">
                Velund AI 5.1
              </h1>
            </div>
            <Button
              variant="ghost"
              className="text-silver hover:text-gold transition-colors"
              onClick={() => navigate('/')}
            >
              <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
              <Icon name="Crown" className="w-4 h-4 mr-1" />
              Premium подписка
            </Badge>
            <h2 className="text-3xl font-bold text-gold mb-2">Оформление подписки</h2>
            <p className="text-silver">Выполните оплату и загрузите чек для активации</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-dark-lighter border-gold/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Icon name={selectedPlan.icon} className="w-6 h-6" />
                  {selectedPlan.name}
                </CardTitle>
                <CardDescription className="text-silver">
                  Доступ на {selectedPlan.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-dark rounded-lg border border-gold/20">
                  <p className="text-sm text-silver mb-2">Стоимость подписки</p>
                  <p className="text-4xl font-bold text-gold">{selectedPlan.price} ₽</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Что входит:</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-silver">
                        <Icon name="Check" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gold/10 rounded-lg border border-gold/30">
                  <p className="text-sm text-gold flex items-center gap-2">
                    <Icon name="Info" className="w-4 h-4" />
                    Активация происходит автоматически после проверки чека администратором
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Icon name="CreditCard" className="w-6 h-6" />
                    Данные для оплаты
                  </CardTitle>
                  <CardDescription className="text-silver">
                    Переведите указанную сумму на карту
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-gold/20 to-gold-dark/20 rounded-lg border-2 border-gold/30">
                    <p className="text-sm text-silver mb-2">Номер карты для перевода</p>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-2xl font-mono font-bold text-gold tracking-wider">
                        {cardNumber}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold/30 text-gold hover:bg-gold/10"
                        onClick={() => {
                          navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
                          alert('Номер карты скопирован!');
                        }}
                      >
                        <Icon name="Copy" className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-silver">Сумма к оплате:</span>
                      <span className="text-2xl font-bold text-gold">{selectedPlan.price} ₽</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <Icon name="AlertTriangle" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-500">
                      <p className="font-semibold mb-1">Важно!</p>
                      <p>
                        Переведите точную сумму {selectedPlan.price} ₽. После оплаты обязательно
                        загрузите чек для активации подписки.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Icon name="Upload" className="w-6 h-6" />
                    Загрузите чек об оплате
                  </CardTitle>
                  <CardDescription className="text-silver">
                    Поддерживаются: JPG, PNG, PDF (макс. 5 МБ)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-gold/30 rounded-lg p-8 text-center hover:border-gold/50 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('receipt-upload')?.click()}
                  >
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {receiptPreview ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          {receiptFile?.type.startsWith('image/') ? (
                            <img
                              src={receiptPreview}
                              alt="Receipt preview"
                              className="max-h-48 rounded-lg border border-gold/20"
                            />
                          ) : (
                            <div className="w-32 h-48 bg-gold/20 rounded-lg flex items-center justify-center">
                              <Icon name="FileText" className="w-16 h-16 text-gold" />
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReceiptFile(null);
                              setReceiptPreview(null);
                            }}
                          >
                            <Icon name="X" className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-silver">{receiptFile?.name}</p>
                      </div>
                    ) : (
                      <>
                        <Icon name="Upload" className="w-12 h-12 text-gold mx-auto mb-3" />
                        <p className="text-gold font-semibold mb-1">Перетащите чек сюда</p>
                        <p className="text-sm text-silver">или нажмите для выбора файла</p>
                      </>
                    )}
                  </div>

                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
                    onClick={handleSubmit}
                    disabled={!receiptFile || uploading}
                  >
                    {uploading ? (
                      <>
                        <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" className="w-4 h-4 mr-2" />
                        Отправить на проверку
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-silver mt-4">
                    Проверка чека занимает от 5 минут до 24 часов. Вы получите уведомление о
                    результате.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
