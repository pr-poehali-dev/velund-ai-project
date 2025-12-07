import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  city: string;
  views: number;
  inquiries: number;
}

interface SupplierProductsTabProps {
  myProducts: Product[];
}

const SupplierProductsTab = ({ myProducts }: SupplierProductsTabProps) => {
  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Icon name="Package" className="w-6 h-6" />
          Активные товары
        </CardTitle>
        <CardDescription className="text-silver">
          Ваши товары в базе Velund AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {myProducts.map((product) => (
          <Card key={product.id} className="bg-dark border-gold/10 hover-scale">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground mb-3">
                    {product.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-silver">Цена:</span>{' '}
                      <span className="text-gold font-bold">
                        {product.price.toLocaleString('ru-RU')} ₽/т
                      </span>
                    </div>
                    <div>
                      <span className="text-silver">Остаток:</span>{' '}
                      <span className="text-foreground font-medium">
                        {product.quantity.toLocaleString('ru-RU')} кг
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" className="w-4 h-4 text-silver" />
                      <span className="text-foreground">{product.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Eye" className="w-4 h-4 text-silver" />
                      <span className="text-foreground">{product.views} просмотров</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <Icon name="MessageCircle" className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500 font-medium">
                        {product.inquiries} запросов от покупателей
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    <Icon name="Edit" className="w-4 h-4 mr-2" />
                    Изменить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                  >
                    <Icon name="Trash" className="w-4 h-4 mr-2" />
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default SupplierProductsTab;
