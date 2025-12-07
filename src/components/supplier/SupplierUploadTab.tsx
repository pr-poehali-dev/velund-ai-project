import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SupplierUploadTabProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  uploading: boolean;
  handleUpload: () => Promise<void>;
}

const SupplierUploadTab = ({
  files,
  setFiles,
  uploading,
  handleUpload
}: SupplierUploadTabProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

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
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                  <Icon name="Upload" className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <p className="text-foreground font-medium mb-1">
                    Перетащите файлы или нажмите для выбора
                  </p>
                  <p className="text-sm text-silver">
                    PDF, Excel, JPG, PNG до 10 МБ
                  </p>
                </div>
              </div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-silver font-medium mb-3">
                Файлы для загрузки ({files.length}):
              </p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-dark rounded-lg border border-gold/20"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="FileText" className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-silver">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => removeFile(index)}
                  >
                    <Icon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale mt-4"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" className="w-4 h-4 mr-2" />
                    Отправить на модерацию
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-dark-lighter border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Icon name="Plus" className="w-6 h-6" />
            Добавить товар вручную
          </CardTitle>
          <CardDescription className="text-silver">
            Укажите информацию о товаре для быстрого добавления
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-silver mb-2">
              Название товара
            </label>
            <Input
              placeholder="Например: Круг ст3 20мм"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="bg-dark border-gold/20 focus:border-gold text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-silver mb-2">
                Цена (₽/тонна)
              </label>
              <Input
                type="number"
                placeholder="48500"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="bg-dark border-gold/20 focus:border-gold text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-silver mb-2">
                Остаток (кг)
              </label>
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
            className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
            onClick={handleAddProduct}
          >
            <Icon name="Plus" className="w-4 h-4 mr-2" />
            Добавить товар
          </Button>
          <div className="p-4 bg-dark/50 rounded-lg border border-gold/10">
            <div className="flex items-start gap-3">
              <Icon name="Info" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="text-sm text-silver">
                <p className="mb-1">
                  <span className="text-gold font-medium">Совет:</span> Для массовой загрузки
                  товаров используйте прайс-листы в Excel или PDF формате
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierUploadTab;
