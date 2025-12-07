import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Supplier = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const uploadedPrices = [
    {
      id: 1,
      fileName: 'прайс_трубы_январь_2024.xlsx',
      uploadDate: '2024-01-20',
      status: 'approved',
      itemsCount: 145,
      views: 234
    },
    {
      id: 2,
      fileName: 'каталог_металл_2024.pdf',
      uploadDate: '2024-01-15',
      status: 'pending',
      itemsCount: 89,
      views: 0
    },
    {
      id: 3,
      fileName: 'прайс_декабрь_2023.xlsx',
      uploadDate: '2023-12-20',
      status: 'rejected',
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== newFiles.length) {
      toast.error('Некоторые файлы имеют неподдерживаемый формат');
    }

    setFiles(prev => [...prev, ...validFiles]);
    toast.success(`Добавлено файлов: ${validFiles.length}`);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('Файл удалён из списка');
  };

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

  const handleAddProduct = () => {
    if (!productName || !productPrice || !productQuantity) {
      toast.error('Заполните все поля');
      return;
    }

    toast.success('Товар добавлен!', {
      description: `${productName} — ${productPrice} ₽`
    });
    
    setProductName('');
    setProductPrice('');
    setProductQuantity('');
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
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-dark-lighter border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-gold flex items-center gap-2">
                      <Icon name="Upload" className="w-6 h-6" />
                      Загрузка файлов
                    </CardTitle>
                    <CardDescription className="text-silver">
                      Поддерживаются: PDF, Excel (XLS, XLSX), изображения (JPG, PNG)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        dragActive
                          ? 'border-gold bg-gold/10'
                          : 'border-gold/30 hover:border-gold/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Icon name="Upload" className="w-16 h-16 text-gold mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gold mb-2">
                        Перетащите файлы сюда
                      </h3>
                      <p className="text-silver mb-4">
                        или нажмите для выбора файлов
                      </p>
                      <Badge className="bg-gold/20 text-gold border-gold/30">
                        Поддерживаются множественные файлы
                      </Badge>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-semibold text-silver mb-3">
                          Выбрано файлов: {files.length}
                        </h4>
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-dark rounded-lg border border-gold/10"
                          >
                            <Icon name="FileText" className="w-5 h-5 text-gold flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-silver">
                                {(file.size / 1024).toFixed(1)} КБ
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-400"
                              onClick={() => removeFile(index)}
                            >
                              <Icon name="X" className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                      onClick={handleUpload}
                      disabled={files.length === 0 || uploading}
                    >
                      {uploading ? (
                        <>
                          <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          Отправка на анализ...
                        </>
                      ) : (
                        <>
                          <Icon name="Send" className="w-4 h-4 mr-2" />
                          Отправить на проверку
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-dark-lighter border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-gold flex items-center gap-2">
                      <Icon name="Plus" className="w-6 h-6" />
                      Добавить товар вручную
                    </CardTitle>
                    <CardDescription className="text-silver">
                      Быстрое добавление отдельных позиций
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Название товара</label>
                      <Input
                        placeholder="Круг ст3 20мм"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="bg-dark border-gold/20 focus:border-gold text-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Цена (₽/тонна)</label>
                        <Input
                          type="number"
                          placeholder="48500"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          className="bg-dark border-gold/20 focus:border-gold text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Количество (кг)</label>
                        <Input
                          type="number"
                          placeholder="3000"
                          value={productQuantity}
                          onChange={(e) => setProductQuantity(e.target.value)}
                          className="bg-dark border-gold/20 focus:border-gold text-foreground"
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                      onClick={handleAddProduct}
                    >
                      <Icon name="Plus" className="w-4 h-4 mr-2" />
                      Добавить товар
                    </Button>

                    <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/30">
                      <p className="text-sm text-gold flex items-start gap-2">
                        <Icon name="Info" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        AI автоматически распознает товары из загруженных файлов. Вручную добавляйте только отдельные позиции.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="prices" className="animate-fade-in">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Загруженные прайс-листы</CardTitle>
                  <CardDescription className="text-silver">
                    История загрузок и статусы модерации
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedPrices.map((price, index) => (
                      <Card
                        key={price.id}
                        className="bg-dark border-gold/10 hover:border-gold/30 transition-all"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon name="FileText" className="w-6 h-6 text-gold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h4 className="text-lg font-semibold text-foreground truncate">
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
                              <div className="grid grid-cols-3 gap-4 text-sm text-silver">
                                <div className="flex items-center gap-2">
                                  <Icon name="Calendar" className="w-4 h-4" />
                                  {new Date(price.uploadDate).toLocaleDateString('ru-RU')}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Package" className="w-4 h-4" />
                                  {price.itemsCount} позиций
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Eye" className="w-4 h-4" />
                                  {price.views} просмотров
                                </div>
                              </div>
                              {price.status === 'rejected' && price.rejectReason && (
                                <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                                  <p className="text-sm text-red-500">
                                    <strong>Причина отклонения:</strong> {price.rejectReason}
                                  </p>
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
            </TabsContent>

            <TabsContent value="products" className="animate-fade-in">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Активные товары</CardTitle>
                  <CardDescription className="text-silver">
                    Товары, доступные в поиске для покупателей
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myProducts.map((product, index) => (
                      <Card
                        key={product.id}
                        className="bg-dark border-gold/10 hover:border-gold/30 transition-all hover-scale"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gold mb-2">
                                {product.name}
                              </h4>
                              <div className="grid md:grid-cols-4 gap-3 text-sm text-silver mb-3">
                                <div className="flex items-center gap-2">
                                  <Icon name="DollarSign" className="w-4 h-4" />
                                  {product.price.toLocaleString('ru-RU')} ₽/т
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Package" className="w-4 h-4" />
                                  {product.quantity} кг
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Eye" className="w-4 h-4" />
                                  {product.views} просмотров
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="MessageSquare" className="w-4 h-4" />
                                  {product.inquiries} запросов
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gold/30 text-gold hover:bg-gold/10"
                              >
                                <Icon name="Edit" className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                              >
                                <Icon name="Trash2" className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Supplier;
