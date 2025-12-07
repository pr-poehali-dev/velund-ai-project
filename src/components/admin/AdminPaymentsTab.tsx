import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface AdminPaymentsTabProps {
  paymentRequests: PaymentRequest[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: 'all' | 'pending' | 'approved' | 'rejected';
  setActiveFilter: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  filteredPayments: PaymentRequest[];
  handleApprovePayment: (paymentId: number) => void;
  handleRejectPayment: (paymentId: number) => void;
  setSelectedReceipt: (url: string) => void;
  planNames: {
    month: string;
    day: string;
  };
}

const AdminPaymentsTab = ({
  paymentRequests,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filteredPayments,
  handleApprovePayment,
  handleRejectPayment,
  setSelectedReceipt,
  planNames
}: AdminPaymentsTabProps) => {
  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold">Модерация платежей</CardTitle>
        <CardDescription className="text-silver">
          Проверка чеков и активация Premium подписок
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-dark border-gold/20 focus:border-gold text-foreground"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              className={activeFilter === 'all' ? 'bg-gold text-dark' : 'border-gold/30 text-gold'}
              onClick={() => setActiveFilter('all')}
            >
              Все ({paymentRequests.length})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === 'pending' ? 'default' : 'outline'}
              className={activeFilter === 'pending' ? 'bg-yellow-500 text-dark' : 'border-yellow-500/30 text-yellow-500'}
              onClick={() => setActiveFilter('pending')}
            >
              На проверке ({paymentRequests.filter(p => p.status === 'pending').length})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === 'approved' ? 'default' : 'outline'}
              className={activeFilter === 'approved' ? 'bg-green-500 text-dark' : 'border-green-500/30 text-green-500'}
              onClick={() => setActiveFilter('approved')}
            >
              Одобрено ({paymentRequests.filter(p => p.status === 'approved').length})
            </Button>
            <Button
              size="sm"
              variant={activeFilter === 'rejected' ? 'default' : 'outline'}
              className={activeFilter === 'rejected' ? 'bg-red-500 text-dark' : 'border-red-500/30 text-red-500'}
              onClick={() => setActiveFilter('rejected')}
            >
              Отклонено ({paymentRequests.filter(p => p.status === 'rejected').length})
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="bg-dark border-gold/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-32 rounded-lg overflow-hidden border border-gold/20 flex-shrink-0 cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => setSelectedReceipt(payment.receiptUrl)}
                  >
                    <img
                      src={payment.receiptUrl}
                      alt="Чек"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-1">
                          {payment.userName}
                        </h4>
                        <p className="text-sm text-silver">{payment.userEmail}</p>
                      </div>
                      <Badge
                        className={
                          payment.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                            : payment.status === 'approved'
                            ? 'bg-green-500/20 text-green-500 border-green-500/30'
                            : 'bg-red-500/20 text-red-500 border-red-500/30'
                        }
                      >
                        {payment.status === 'pending'
                          ? 'На проверке'
                          : payment.status === 'approved'
                          ? 'Одобрено'
                          : 'Отклонено'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-silver">Тариф:</span>{' '}
                        <span className="text-foreground font-medium">{planNames[payment.plan]}</span>
                      </div>
                      <div>
                        <span className="text-silver">Сумма:</span>{' '}
                        <span className="text-gold font-bold">{payment.amount} ₽</span>
                      </div>
                      <div>
                        <span className="text-silver">Дата:</span>{' '}
                        <span className="text-foreground font-medium">
                          {new Date(payment.date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    {payment.status === 'pending' && (
                      <div className="flex gap-3">
                        <Button
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white hover-scale"
                          onClick={() => handleApprovePayment(payment.id)}
                        >
                          <Icon name="Check" className="w-4 h-4 mr-2" />
                          Подтвердить платеж
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleRejectPayment(payment.id)}
                        >
                          <Icon name="X" className="w-4 h-4 mr-2" />
                          Отклонить
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPaymentsTab;
