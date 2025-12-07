import Icon from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PriceUpload {
  id: number;
  fileName: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  itemsCount: number;
  views: number;
  rejectReason?: string;
}

interface SupplierPricesTabProps {
  uploadedPrices: PriceUpload[];
}

const SupplierPricesTab = ({ uploadedPrices }: SupplierPricesTabProps) => {
  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Icon name="FileText" className="w-6 h-6" />
          История загрузок
        </CardTitle>
        <CardDescription className="text-silver">
          Статусы ваших прайс-листов и каталогов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {uploadedPrices.map((price) => (
          <Card key={price.id} className="bg-dark border-gold/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-foreground">
                      {price.fileName}
                    </h4>
                    <Badge
                      className={
                        price.status === 'approved'
                          ? 'bg-green-500/20 text-green-500 border-green-500/30'
                          : price.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-500 border-red-500/30'
                      }
                    >
                      {price.status === 'approved'
                        ? 'Одобрено'
                        : price.status === 'pending'
                        ? 'На проверке'
                        : 'Отклонено'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm text-silver">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" className="w-4 h-4" />
                      {new Date(price.uploadDate).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Package" className="w-4 h-4" />
                      Позиций: {price.itemsCount}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Eye" className="w-4 h-4" />
                      Просмотры: {price.views}
                    </div>
                  </div>
                  {price.rejectReason && (
                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-start gap-2">
                        <Icon name="AlertCircle" className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-500 mb-1">
                            Причина отклонения:
                          </p>
                          <p className="text-sm text-silver">{price.rejectReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default SupplierPricesTab;
