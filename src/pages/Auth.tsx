import { useState } from 'react';
import { toast } from 'sonner';
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
  const [selectedRole, setSelectedRole] = useState<'user' | 'premium'>('user');

  const [loading, setLoading] = useState(false);
  const API_URL = 'https://functions.poehali.dev/580b33e9-2602-423a-bd33-2eea5895bfe7';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Ошибка входа');
        setLoading(false);
        return;
      }

      localStorage.setItem('velund_user', JSON.stringify(data.user));
      localStorage.setItem('velund_token', data.token);

      toast.success('Добро пожаловать!', {
        description: `${data.user.full_name} (${data.user.role})`
      });

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerName) {
      toast.error('Заполните обязательные поля');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: registerEmail,
          password: registerPassword,
          full_name: registerName,
          phone: registerPhone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Ошибка регистрации');
        setLoading(false);
        return;
      }

      localStorage.setItem('velund_user', JSON.stringify(data.user));
      localStorage.setItem('velund_token', data.token);

      toast.success('Регистрация успешна!', {
        description: 'Добро пожаловать в Velund AI'
      });

      navigate('/dashboard');
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'user' as const,
      name: 'Пробный (1 день)',
      icon: 'User',
      price: '150 ₽',
      features: [
        'Полный доступ на 1 день',
        'Поиск по базе поставщиков',
        'Просмотр прайс-листов',
        'AI помощник',
        'Экспорт данных'
      ],
      color: 'silver'
    },
    {
      id: 'premium' as const,
      name: 'Premium (1 месяц)',
      icon: 'Crown',
      price: '1,200 ₽/мес',
      features: [
        'Полный доступ на 30 дней',
        'Неограниченный поиск',
        'Загрузка своих прайсов',
        'Экспорт данных',
        'AI помощник без ограничений',
        'Приоритетная поддержка'
      ],
      color: 'gold',
      popular: true
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      <>
                        <Icon name="LogIn" className="w-4 h-4 mr-2" />
                        Войти
                      </>
                    )}
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
            <Card className="max-w-md mx-auto bg-dark-lighter border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gold">Создать аккаунт</CardTitle>
                <CardDescription className="text-silver">
                  Регистрация бесплатна. После входа выберите тариф для доступа к функциям.
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
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          Регистрация...
                        </>
                      ) : (
                        <>
                          <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                          Зарегистрироваться
                        </>
                      )}
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