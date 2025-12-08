import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-gold/20 bg-dark-lighter/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold via-gold-light to-silver rounded-lg flex items-center justify-center">
                <Icon name="Hammer" className="w-6 h-6 text-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-gold">Velund AI 5.1</h1>
                <p className="text-sm text-silver">Платформа для работы с металлопрокатом</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
            >
              <Icon name="LogIn" className="w-4 h-4 mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold text-gradient-gold mb-6">
              Автоматизация работы с металлопрокатом
            </h2>
            <p className="text-xl text-silver mb-8 max-w-3xl mx-auto">
              AI-платформа для поиска поставщиков, анализа цен и управления прайс-листами
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold text-lg px-8 py-6 hover-scale"
            >
              <Icon name="Sparkles" className="w-5 h-5 mr-2" />
              Начать работу
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Search" className="w-6 h-6 text-gold" />
                </div>
                <CardTitle className="text-gold">Умный поиск</CardTitle>
                <CardDescription className="text-silver">
                  Найдите нужного поставщика за секунды с помощью AI-помощника
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="TrendingDown" className="w-6 h-6 text-gold" />
                </div>
                <CardTitle className="text-gold">Анализ цен</CardTitle>
                <CardDescription className="text-silver">
                  Сравнивайте цены от разных поставщиков и находите лучшие предложения
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="FileText" className="w-6 h-6 text-gold" />
                </div>
                <CardTitle className="text-gold">Загрузка прайсов</CardTitle>
                <CardDescription className="text-silver">
                  Добавляйте свои прайс-листы и получайте заявки от покупателей
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-dark-lighter border-gold/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-2xl text-gold text-center">Тарифы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-dark border-silver/20 hover-scale">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-silver">Пробный доступ</CardTitle>
                      <Icon name="Calendar" className="w-8 h-8 text-silver" />
                    </div>
                    <div className="text-3xl font-bold text-silver mb-4">150 ₽</div>
                    <CardDescription className="text-silver/70">1 день полного доступа</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-silver">
                        <Icon name="Check" className="w-4 h-4 text-gold" />
                        Поиск по базе поставщиков
                      </li>
                      <li className="flex items-center gap-2 text-silver">
                        <Icon name="Check" className="w-4 h-4 text-gold" />
                        AI помощник
                      </li>
                      <li className="flex items-center gap-2 text-silver">
                        <Icon name="Check" className="w-4 h-4 text-gold" />
                        Экспорт данных
                      </li>
                    </ul>
                    <Button
                      className="w-full bg-gradient-to-r from-silver to-silver/70 text-dark hover-scale"
                      onClick={() => navigate('/auth')}
                    >
                      Попробовать
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-dark border-gold/20 hover-scale relative">
                  <div className="absolute -top-3 right-4">
                    <span className="bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full">
                      Популярный
                    </span>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-gold">Premium</CardTitle>
                      <Icon name="Crown" className="w-8 h-8 text-gold" />
                    </div>
                    <div className="text-3xl font-bold text-gold mb-4">1,200 ₽</div>
                    <CardDescription className="text-silver/70">1 месяц полного доступа</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-silver">
                        <Icon name="Check" className="w-4 h-4 text-gold" />
                        Всё из пробного доступа
                      </li>
                      <li className="flex items-center gap-2 text-silver">
                        <Icon name="Check" className="w-4 h-4 text-gold" />
                        Неограниченный AI поиск
                      </li>
                      <li className="flex items-center gap-2 text-silver">
                        <Icon name="Check" className="w-4 h-4 text-gold" />
                        Загрузка своих прайсов
                      </li>
                      <li className="flex items-center gap-2 text-silver">
                        <Icon name="Check" className="w-4 h-4 text-gold" />
                        Приоритетная поддержка
                      </li>
                    </ul>
                    <Button
                      className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                      onClick={() => navigate('/auth')}
                    >
                      Подключить
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-gold/20 bg-dark-lighter/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-silver text-sm">
            <p>© 2024 Velund AI. Платформа для автоматизации работы с металлопрокатом</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
