import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface AdminUploadsTabProps {
  uploadRequests: UploadRequest[];
  activeFilter: 'all' | 'pending' | 'approved' | 'rejected';
  setActiveFilter: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  filteredUploads: UploadRequest[];
  handleApproveUpload: (uploadId: number) => void;
  handleRejectUpload: (uploadId: number) => void;
}

const AdminUploadsTab = ({
  uploadRequests,
  activeFilter,
  setActiveFilter,
  filteredUploads,
  handleApproveUpload,
  handleRejectUpload
}: AdminUploadsTabProps) => {
  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Icon name="Bot" className="w-6 h-6" />
          AI-анализ загрузок
        </CardTitle>
        <CardDescription className="text-silver">
          Заявки на модерацию прайс-листов и каталогов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            className={activeFilter === 'all' ? 'bg-gold text-dark' : 'border-gold/30 text-gold'}
            onClick={() => setActiveFilter('all')}
          >
            Все ({uploadRequests.length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'pending' ? 'default' : 'outline'}
            className={activeFilter === 'pending' ? 'bg-yellow-500 text-dark' : 'border-yellow-500/30 text-yellow-500'}
            onClick={() => setActiveFilter('pending')}
          >
            На проверке ({uploadRequests.filter(u => u.status === 'pending').length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'approved' ? 'default' : 'outline'}
            className={activeFilter === 'approved' ? 'bg-green-500 text-dark' : 'border-green-500/30 text-green-500'}
            onClick={() => setActiveFilter('approved')}
          >
            Одобрено ({uploadRequests.filter(u => u.status === 'approved').length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === 'rejected' ? 'default' : 'outline'}
            className={activeFilter === 'rejected' ? 'bg-red-500 text-dark' : 'border-red-500/30 text-red-500'}
            onClick={() => setActiveFilter('rejected')}
          >
            Отклонено ({uploadRequests.filter(u => u.status === 'rejected').length})
          </Button>
        </div>

        <div className="space-y-3">
          {filteredUploads.map((upload) => (
            <Card key={upload.id} className="bg-dark border-gold/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-foreground">
                          {upload.fileName}
                        </h4>
                        <Badge
                          className={
                            upload.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                              : upload.status === 'approved'
                              ? 'bg-green-500/20 text-green-500 border-green-500/30'
                              : 'bg-red-500/20 text-red-500 border-red-500/30'
                          }
                        >
                          {upload.status === 'pending'
                            ? 'На проверке'
                            : upload.status === 'approved'
                            ? 'Одобрено'
                            : 'Отклонено'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm text-silver">
                        <div className="flex items-center gap-2">
                          <Icon name="User" className="w-4 h-4" />
                          {upload.userName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" className="w-4 h-4" />
                          {new Date(upload.uploadDate).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Bot" className="w-4 h-4" />
                          AI оценка: {upload.aiScore}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-dark-lighter rounded-lg border border-gold/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Bot" className="w-5 h-5 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-gold mb-1">
                          Отчёт AI-ассистента
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-silver">Тип:</span>{' '}
                            <span className="text-foreground font-medium">{upload.aiReport.type}</span>
                          </div>
                          <div>
                            <span className="text-silver">Категория:</span>{' '}
                            <span className="text-foreground font-medium">{upload.aiReport.category}</span>
                          </div>
                          <div>
                            <span className="text-silver">Позиций:</span>{' '}
                            <span className="text-foreground font-medium">{upload.aiReport.itemsFound}</span>
                          </div>
                          <div>
                            <span className="text-silver">Качество:</span>{' '}
                            <span className="text-foreground font-medium">{upload.aiReport.quality}</span>
                          </div>
                        </div>
                        <p className="text-sm text-silver mb-2">{upload.aiReport.details}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Icon name="Lightbulb" className="w-4 h-4 text-gold" />
                          <span className="text-sm font-semibold text-gold">
                            Рекомендация: {upload.aiReport.recommendation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {upload.status === 'pending' && (
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover-scale"
                        onClick={() => handleApproveUpload(upload.id)}
                      >
                        <Icon name="Check" className="w-4 h-4 mr-2" />
                        Принять в базу
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                        onClick={() => handleRejectUpload(upload.id)}
                      >
                        <Icon name="X" className="w-4 h-4 mr-2" />
                        Отклонить
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUploadsTab;
