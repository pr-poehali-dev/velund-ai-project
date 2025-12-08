import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API_URL = 'https://functions.poehali.dev/b24c5b05-f128-4d2c-9b06-d2e9aed4eddf';

interface Supplier {
  id: number;
  company_name: string;
  city: string;
  phone: string;
  email: string;
  website_url: string;
  description: string;
  status: string;
  user_name: string;
  user_email: string;
  created_at: string;
  file_name?: string;
  file_data?: string;
  file_size?: number;
}

const SupplierModeration = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchSuppliers = async () => {
    const user = localStorage.getItem('velund_user');
    const userData = user ? JSON.parse(user) : null;

    if (!userData?.id) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?admin=true&status=pending`, {
        headers: {
          'X-User-Id': userData.id.toString()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Ошибка загрузки');
        setLoading(false);
        return;
      }

      setSuppliers(data);
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (supplierId: number, action: 'approve' | 'reject') => {
    const user = localStorage.getItem('velund_user');
    const userData = user ? JSON.parse(user) : null;

    if (!userData?.id) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    setActionLoading(supplierId);

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userData.id.toString()
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          action: action,
          rejection_reason: action === 'reject' ? 'Не соответствует требованиям' : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Ошибка модерации');
        setActionLoading(null);
        return;
      }

      if (action === 'approve') {
        toast.success('Поставщик одобрен!', {
          description: 'Сейчас система автоматически парсит файл и добавит товары в базу'
        });
      } else {
        toast.error('Поставщик отклонен', {
          description: 'Пользователь получит уведомление'
        });
      }

      fetchSuppliers();
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gold flex items-center gap-2">
              <Icon name="CheckSquare" className="w-6 h-6" />
              Модерация поставщиков
            </CardTitle>
            <CardDescription className="text-silver">
              Заявки от пользователей на добавление поставщиков
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-gold/30 text-gold"
            onClick={fetchSuppliers}
            disabled={loading}
          >
            <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" className="w-12 h-12 text-silver mx-auto mb-3" />
            <p className="text-silver">Нет заявок на модерацию</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="bg-dark border-gold/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gold mb-1">
                          {supplier.company_name}
                        </h4>
                        <p className="text-sm text-silver">
                          Добавил: {supplier.user_name} ({supplier.user_email})
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        {supplier.city && (
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" className="w-4 h-4 text-silver" />
                            <span className="text-foreground">{supplier.city}</span>
                          </div>
                        )}
                        {supplier.phone && (
                          <div className="flex items-center gap-2">
                            <Icon name="Phone" className="w-4 h-4 text-silver" />
                            <span className="text-foreground">{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center gap-2">
                            <Icon name="Mail" className="w-4 h-4 text-silver" />
                            <span className="text-foreground">{supplier.email}</span>
                          </div>
                        )}
                        {supplier.website_url && (
                          <div className="flex items-center gap-2">
                            <Icon name="Globe" className="w-4 h-4 text-silver" />
                            <a 
                              href={supplier.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gold hover:underline"
                            >
                              Сайт
                            </a>
                          </div>
                        )}
                      </div>

                      {supplier.file_name && (
                        <div className="flex items-center gap-2 p-3 bg-dark rounded border border-gold/10">
                          <Icon name="FileText" className="w-5 h-5 text-gold" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {supplier.file_name}
                            </p>
                            {supplier.file_size && (
                              <p className="text-xs text-silver">
                                {(supplier.file_size / 1024).toFixed(1)} KB
                              </p>
                            )}
                          </div>
                          <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
                            Прайс-лист
                          </Badge>
                        </div>
                      )}

                      {supplier.description && (
                        <p className="text-sm text-silver bg-dark p-3 rounded border border-gold/10">
                          {supplier.description}
                        </p>
                      )}

                      <div className="text-xs text-silver">
                        Дата: {new Date(supplier.created_at).toLocaleString('ru-RU')}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleModeration(supplier.id, 'approve')}
                        disabled={actionLoading === supplier.id}
                      >
                        {actionLoading === supplier.id ? (
                          <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Icon name="Check" className="w-4 h-4 mr-1" />
                            Одобрить
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                        onClick={() => handleModeration(supplier.id, 'reject')}
                        disabled={actionLoading === supplier.id}
                      >
                        <Icon name="X" className="w-4 h-4 mr-1" />
                        Отклонить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupplierModeration;