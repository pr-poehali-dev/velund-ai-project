import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'premium' | 'admin'>('user');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login:', { loginEmail, loginPassword });
    navigate('/');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Register:', { registerName, registerEmail, registerPassword, registerPhone, selectedRole });
    navigate('/');
  };

  const roles = [
    {
      id: 'user' as const,
      name: 'Базовый',
      icon: 'User',
      price: 'Бесплатно',
      features: [
        'Поиск по базе поставщиков',
        'Просмотр прайс-листов',
        'Базовая статистика',
        '10 запросов к AI в день'
      ],
      color: 'silver'
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      icon: 'Crown',
      price: '4,990 ₽/мес',
      features: [
        'Всё из базового тарифа',
        'Неограниченные AI запросы',
        'Загрузка своих прайсов',
        'Экспорт данных',
        'Уведомления о ценах',
        'Приоритетная поддержка'
      ],
      color: 'gold',
      popular: true
    },
    {
      id: 'admin' as const,
      name: 'Администратор',
      icon: 'Shield',
      price: 'По запросу',
      features: [
        'Полный доступ к системе',
        'Управление пользователями',
        'Управление базой данных',
        'Модерация контента',
        'Аналитика и отчёты',
        'API доступ'
      ],
      color: 'gold-dark'
    }
  ];

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold via-gold-light to-silver rounded-lg flex items-center justify-center">
              <Icon name="Hammer" className="w-7 h-7 text-dark" />
            </div>
            <h1 className="text-4xl font-bold font-montserrat text-gradient-gold">
              Velund AI 5.1
            </h1>
          </div>
          <p className="text-silver text-lg">
            Платформа для автоматизации работы с металлопрокатом
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-dark-lighter border border-gold/20">
            <TabsTrigger value="login" className="data-[state=active]:bg-gold data-[state=active]:text-dark">
              Вход
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-gold data-[state=active]:text-dark">
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="animate-fade-in mt-6">
            <Card className="max-w-md mx-auto bg-dark-lighter border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gold">Войти в систему</CardTitle>
                <CardDescription className="text-silver">
                  Введите ваши данные для входа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-dark border-gold/20 focus:border-gold text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Пароль</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-dark border-gold/20 focus:border-gold text-foreground"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
                  >
                    <Icon name="LogIn" className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                  <p className="text-center text-sm text-silver">
                    Нет аккаунта?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-gold hover:text-gold-light transition-colors"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="animate-fade-in mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-gold">Создать аккаунт</CardTitle>
                  <CardDescription className="text-silver">
                    Заполните форму для регистрации
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Полное имя</label>
                      <Input
                        type="text"
                        placeholder="Иван Иванов"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="bg-dark border-gold/20 focus:border-gold text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="bg-dark border-gold/20 focus:border-gold text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Телефон</label>
                      <Input
                        type="tel"
                        placeholder="+7 (900) 123-45-67"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className="bg-dark border-gold/20 focus:border-gold text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Пароль</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="bg-dark border-gold/20 focus:border-gold text-foreground"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
                    >
                      <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                      Зарегистрироваться
                    </Button>
                    <p className="text-center text-sm text-silver">
                      Уже есть аккаунт?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-gold hover:text-gold-light transition-colors"
                      >
                        Войти
                      </button>
                    </p>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gold mb-4">Выберите тариф</h3>
                {roles.map((role, index) => (
                  <Card
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`cursor-pointer transition-all hover-scale ${
                      selectedRole === role.id
                        ? 'bg-dark-lighter border-gold border-2'
                        : 'bg-dark-lighter border-gold/20'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-${role.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon name={role.icon} className={`w-6 h-6 text-${role.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-lg font-semibold text-${role.color}`}>
                              {role.name}
                            </h4>
                            {role.popular && (
                              <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
                                Популярный
                              </Badge>
                            )}
                          </div>
                          <p className="text-xl font-bold text-foreground mb-3">{role.price}</p>
                          <ul className="space-y-1">
                            {role.features.map((feature, i) => (
                              <li key={i} className="text-sm text-silver flex items-start gap-2">
                                <Icon name="Check" className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {selectedRole === role.id && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                              <Icon name="Check" className="w-4 h-4 text-dark" />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-silver">
            Регистрируясь, вы соглашаетесь с{' '}
            <a href="#" className="text-gold hover:text-gold-light transition-colors">
              условиями использования
            </a>{' '}
            и{' '}
            <a href="#" className="text-gold hover:text-gold-light transition-colors">
              политикой конфиденциальности
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
