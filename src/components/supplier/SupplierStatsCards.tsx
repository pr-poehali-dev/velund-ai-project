import Icon from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SupplierStatsCardsProps {
  stats: {
    totalProducts: number;
    totalViews: number;
    totalInquiries: number;
    pendingPrices: number;
  };
}

const SupplierStatsCards = ({ stats }: SupplierStatsCardsProps) => {
  return (
    <div className="grid lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="Package" className="w-8 h-8 text-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-gold">{stats.totalProducts}</CardTitle>
          <CardDescription className="text-silver">Активных товаров</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-dark-lighter border-blue-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="Eye" className="w-8 h-8 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-500">{stats.totalViews}</CardTitle>
          <CardDescription className="text-silver">Просмотров</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-dark-lighter border-green-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="MessageCircle" className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">{stats.totalInquiries}</CardTitle>
          <CardDescription className="text-silver">Запросов</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-dark-lighter border-yellow-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon name="Clock" className="w-8 h-8 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-500">{stats.pendingPrices}</CardTitle>
          <CardDescription className="text-silver">На модерации</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SupplierStatsCards;
