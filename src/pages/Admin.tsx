import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminUploadsTab from '@/components/admin/AdminUploadsTab';
import AdminPaymentsTab from '@/components/admin/AdminPaymentsTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';

interface PaymentRequest {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  plan: 'month' | 'day';
  amount: number;
  receiptUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface UploadRequest {
  id: number;
  userId: number;
  userName: string;
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  aiScore: number;
  aiReport: {
    type: string;
    category: string;
    itemsFound: number;
    quality: string;
    recommendation: string;
    details: string;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const mockPayments: PaymentRequest[] = [
    {
      id: 1,
      userId: 'user_001',
      userName: 'Иван Иванов',
      userEmail: 'ivan@example.com',
      plan: 'month',
      amount: 1200,
      receiptUrl: 'https://via.placeholder.com/300x400',
      status: 'pending',
      date: '2024-01-20T10:30:00'
    },
    {
      id: 2,
      userId: 'user_002',
      userName: 'Петр Петров',
      userEmail: 'petr@example.com',
      plan: 'day',
      amount: 150,
      receiptUrl: 'https://via.placeholder.com/300x400',
      status: 'pending',
      date: '2024-01-20T11:15:00'
    },
    {
      id: 3,
      userId: 'user_003',
      userName: 'Мария Сидорова',
      userEmail: 'maria@example.com',
      plan: 'month',
      amount: 1200,
      receiptUrl: 'https://via.placeholder.com/300x400',
      status: 'approved',
      date: '2024-01-19T14:20:00'
    }
  ];

  const mockUploadRequests: UploadRequest[] = [
    {
      id: 1,
      userId: 101,
      userName: 'ООО "СталПром"',
      fileName: 'прайс_трубы_2024.xlsx',
      uploadDate: '2024-01-22',
      status: 'pending',
      aiScore: 93,
      aiReport: {
        type: 'Прайс-лист',
        category: 'Металлопрокат: трубы',
        itemsFound: 145,
        quality: 'Отличное',
        recommendation: 'Добавить в базу',
        details: 'Обнаружено 145 позиций труб различного диаметра. Все поля заполнены корректно: артикул, размер, цена, количество. Формат стандартный.'
      }
    },
    {
      id: 2,
      userId: 102,
      userName: 'ИП Иванов А.С.',
      fileName: 'каталог_металл.pdf',
      uploadDate: '2024-01-21',
      status: 'pending',
      aiScore: 78,
      aiReport: {
        type: 'Каталог',
        category: 'Металлопрокат: смешанный',
        itemsFound: 67,
        quality: 'Хорошее',
        recommendation: 'Требуется уточнение',
        details: 'Найдено 67 позиций. Отсутствуют цены у 12 позиций. Рекомендуется запросить у поставщика обновленный прайс с ценами.'
      }
    }
  ];

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(mockPayments);
  const [uploadRequests, setUploadRequests] = useState<UploadRequest[]>(mockUploadRequests);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const handleApprovePayment = (paymentId: number) => {
    setPaymentRequests(prev =>
      prev.map(payment =>
        payment.id === paymentId ? { ...payment, status: 'approved' as const } : payment
      )
    );
    toast.success('Платеж подтвержден!', {
      description: 'Пользователю автоматически открыт Premium доступ'
    });
  };

  const handleRejectPayment = (paymentId: number) => {
    setPaymentRequests(prev =>
      prev.map(payment =>
        payment.id === paymentId ? { ...payment, status: 'rejected' as const } : payment
      )
    );
    toast.error('Платеж отклонён', {
      description: 'Пользователь получит уведомление об отклонении'
    });
  };

  const handleApproveUpload = (uploadId: number) => {
    setUploadRequests(prev =>
      prev.map(upload =>
        upload.id === uploadId ? { ...upload, status: 'approved' as const } : upload
      )
    );
    toast.success('Прайс-лист одобрен!', {
      description: 'Позиции добавлены в базу поставщиков'
    });
  };

  const handleRejectUpload = (uploadId: number) => {
    setUploadRequests(prev =>
      prev.map(upload =>
        upload.id === uploadId ? { ...upload, status: 'rejected' as const } : upload
      )
    );
    toast.error('Прайс-лист отклонён', {
      description: 'Поставщик получит уведомление с рекомендациями'
    });
  };

  const filteredPayments = paymentRequests.filter(payment => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'all' || payment.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUploads = uploadRequests.filter(upload => {
    if (activeFilter === 'all') return true;
    return upload.status === activeFilter;
  });

  const stats = {
    pendingPayments: paymentRequests.filter(p => p.status === 'pending').length,
    approvedPayments: paymentRequests.filter(p => p.status === 'approved').length,
    rejectedPayments: paymentRequests.filter(p => p.status === 'rejected').length,
    totalRevenue: paymentRequests
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingUploads: uploadRequests.filter(u => u.status === 'pending').length
  };

  const planNames = {
    month: 'Месяц Безлимит',
    day: 'День Безлимит'
  };

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
              <Badge className="bg-gold-dark/20 text-gold-dark border-gold-dark/30">
                <Icon name="Shield" className="w-4 h-4 mr-1" />
                Админ-панель
              </Badge>
            </div>
            <nav className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => navigate('/')}
              >
                <Icon name="Home" className="w-4 h-4 mr-2" />
                Главная
              </Button>
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => navigate('/profile')}
              >
                <Icon name="User" className="w-4 h-4 mr-2" />
                Профиль
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gold mb-2">Панель администратора</h2>
            <p className="text-silver">Управление модерацией и платежами</p>
          </div>

          <AdminStatsCards stats={stats} />

          <Tabs defaultValue="uploads" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-dark-lighter border border-gold/20">
              <TabsTrigger
                value="uploads"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="FileText" className="w-4 h-4 mr-2" />
                Заявки AI
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="CreditCard" className="w-4 h-4 mr-2" />
                Платежи
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="Users" className="w-4 h-4 mr-2" />
                Пользователи
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploads" className="animate-fade-in space-y-6">
              <AdminUploadsTab
                uploadRequests={uploadRequests}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                filteredUploads={filteredUploads}
                handleApproveUpload={handleApproveUpload}
                handleRejectUpload={handleRejectUpload}
              />
            </TabsContent>

            <TabsContent value="payments" className="animate-fade-in space-y-6">
              <AdminPaymentsTab
                paymentRequests={paymentRequests}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                filteredPayments={filteredPayments}
                handleApprovePayment={handleApprovePayment}
                handleRejectPayment={handleRejectPayment}
                setSelectedReceipt={setSelectedReceipt}
                planNames={planNames}
              />
            </TabsContent>

            <TabsContent value="users" className="animate-fade-in">
              <AdminUsersTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {selectedReceipt && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-4 -right-4 z-10"
              onClick={() => setSelectedReceipt(null)}
            >
              <Icon name="X" className="w-4 h-4" />
            </Button>
            <img
              src={selectedReceipt}
              alt="Чек (увеличено)"
              className="rounded-lg border-2 border-gold/30 max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
