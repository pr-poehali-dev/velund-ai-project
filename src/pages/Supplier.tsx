import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import SupplierStatsCards from '@/components/supplier/SupplierStatsCards';
import SupplierUploadTab from '@/components/supplier/SupplierUploadTab';
import SupplierPricesTab from '@/components/supplier/SupplierPricesTab';
import SupplierProductsTab from '@/components/supplier/SupplierProductsTab';

const Supplier = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadedPrices = [
    {
      id: 1,
      fileName: 'прайс_трубы_январь_2024.xlsx',
      uploadDate: '2024-01-20',
      status: 'approved' as const,
      itemsCount: 145,
      views: 234
    },
    {
      id: 2,
      fileName: 'каталог_металл_2024.pdf',
      uploadDate: '2024-01-15',
      status: 'pending' as const,
      itemsCount: 89,
      views: 0
    },
    {
      id: 3,
      fileName: 'прайс_декабрь_2023.xlsx',
      uploadDate: '2023-12-20',
      status: 'rejected' as const,
      itemsCount: 0,
      views: 0,
      rejectReason: 'Неполная информация о товарах'
    }
  ];

  const myProducts = [
    {
      id: 1,
      name: 'Круг ст3 20мм',
      price: 48500,
      quantity: 3000,
      city: 'Казань',
      views: 156,
      inquiries: 12
    },
    {
      id: 2,
      name: 'Труба профильная 40х40',
      price: 52000,
      quantity: 2000,
      city: 'Казань',
      views: 89,
      inquiries: 7
    }
  ];

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Выберите файлы для загрузки');
      return;
    }

    setUploading(true);
    
    setTimeout(() => {
      setUploading(false);
      toast.success('Файлы отправлены на модерацию!', {
        description: 'AI проанализирует прайс-листы. Результат появится в разделе "Мои прайсы"'
      });
      setFiles([]);
    }, 2000);
  };

  const stats = {
    totalProducts: myProducts.length,
    totalViews: myProducts.reduce((sum, p) => sum + p.views, 0),
    totalInquiries: myProducts.reduce((sum, p) => sum + p.inquiries, 0),
    pendingPrices: uploadedPrices.filter(p => p.status === 'pending').length
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
              <Icon name="Store" className="w-8 h-8 text-dark" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gold">Панель поставщика</h2>
              <p className="text-silver">Управление прайс-листами и товарами</p>
            </div>
            <Badge className="ml-auto bg-gold/20 text-gold border-gold/30">
              <Icon name="Store" className="w-4 h-4 mr-1" />
              Поставщик
            </Badge>
          </div>

          <SupplierStatsCards stats={stats} />

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-dark-lighter border border-gold/20">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="Upload" className="w-4 h-4 mr-2" />
                Загрузить прайс
              </TabsTrigger>
              <TabsTrigger
                value="prices"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="FileText" className="w-4 h-4 mr-2" />
                Мои прайсы
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="Package" className="w-4 h-4 mr-2" />
                Товары
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="animate-fade-in space-y-6">
              <SupplierUploadTab
                files={files}
                setFiles={setFiles}
                uploading={uploading}
                handleUpload={handleUpload}
              />
            </TabsContent>

            <TabsContent value="prices" className="animate-fade-in">
              <SupplierPricesTab uploadedPrices={uploadedPrices} />
            </TabsContent>

            <TabsContent value="products" className="animate-fade-in">
              <SupplierProductsTab myProducts={myProducts} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Supplier;
