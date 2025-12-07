import Icon from '@/components/ui/icon';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminStatsCardsProps {
  stats: {
    pendingPayments: number;
    approvedPayments: number;
    rejectedPayments: number;
    totalRevenue: number;
    pendingUploads: number;
  };
}

const AdminStatsCards = ({ stats }: AdminStatsCardsProps) => {
  return (
    <div className="grid lg:grid-cols-5 gap-6 mb-8">
      <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="FileText" className="w-8 h-8 text-gold" />
            <Badge className="bg-gold/20 text-gold border-gold/30">
              AI заявки
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-gold">{stats.pendingUploads}</CardTitle>
          <CardDescription className="text-silver">На модерации</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-dark-lighter border-yellow-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="Clock" className="w-8 h-8 text-yellow-500" />
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
              Платежи
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-500">{stats.pendingPayments}</CardTitle>
          <CardDescription className="text-silver">Ожидают проверки</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-dark-lighter border-green-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="CheckCircle" className="w-8 h-8 text-green-500" />
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
              Одобрено
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">{stats.approvedPayments}</CardTitle>
          <CardDescription className="text-silver">Платежей подтверждено</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-dark-lighter border-red-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="XCircle" className="w-8 h-8 text-red-500" />
            <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Отклонено</Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-red-500">{stats.rejectedPayments}</CardTitle>
          <CardDescription className="text-silver">Платежей отклонено</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="DollarSign" className="w-8 h-8 text-gold" />
            <Badge className="bg-gold/20 text-gold border-gold/30">Выручка</Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-gold">
            {stats.totalRevenue.toLocaleString('ru-RU')} ₽
          </CardTitle>
          <CardDescription className="text-silver">Общий доход</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminStatsCards;
