import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('velund_user');
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gold via-gold-light to-silver rounded-lg flex items-center justify-center">
              <Icon name="Hammer" className="w-6 h-6 text-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-gold">Velund AI Dashboard</h1>
              <p className="text-silver">Добро пожаловать в систему</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-silver hover:text-gold"
            onClick={() => navigate('/')}
          >
            <Icon name="Home" className="w-4 h-4 mr-2" />
            Главная
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-dark-lighter border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Icon name="Crown" className="w-6 h-6" />
                Добро пожаловать!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-silver mb-4">
                Вы успешно зарегистрировались в системе Velund AI. 
              </p>
              <p className="text-silver mb-4">
                Для доступа к полному функционалу платформы выберите тариф:
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-silver to-silver/70 text-dark hover-scale"
                  onClick={() => navigate('/payment?plan=day')}
                >
                  <Icon name="Calendar" className="w-4 h-4 mr-2" />
                  Пробный доступ (1 день) - 150₽
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                  onClick={() => navigate('/payment?plan=month')}
                >
                  <Icon name="Crown" className="w-4 h-4 mr-2" />
                  Premium (1 месяц) - 1,200₽
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-lighter border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Icon name="Sparkles" className="w-6 h-6" />
                Что доступно?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-silver">
                  <Icon name="Check" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>Поиск по базе поставщиков металлопроката</span>
                </li>
                <li className="flex items-start gap-2 text-silver">
                  <Icon name="Check" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>AI помощник для поиска и анализа цен</span>
                </li>
                <li className="flex items-start gap-2 text-silver">
                  <Icon name="Check" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>Загрузка и модерация прайс-листов</span>
                </li>
                <li className="flex items-start gap-2 text-silver">
                  <Icon name="Check" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>Экспорт данных в удобном формате</span>
                </li>
                <li className="flex items-start gap-2 text-silver">
                  <Icon name="Check" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>Уведомления об изменении цен</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
