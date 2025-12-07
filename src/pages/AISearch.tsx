import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API_URL = 'https://functions.poehali.dev/6b310976-03ea-4e8c-8e92-73963481f917';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  city: string;
  company_name: string;
  supplier_city: string;
  phone: string;
  email: string;
  rating: number;
}

interface SearchResult {
  query: string;
  parsed: {
    product?: string;
    city?: string;
    max_price?: number;
    category?: string;
  };
  results: Product[];
  count: number;
}

const AISearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const popularQueries = [
    'Найди швеллер 14П в Казани дешевле 90000',
    'Труба профильная 40х40 в Москве',
    'Круг ст3 20мм наличие больше 1000 кг',
    'Лист 10мм Санкт-Петербург',
    'Балка двутавровая номер 20'
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Введите запрос');
      return;
    }

    setLoading(true);
    
    const user = localStorage.getItem('velund_user');
    const userData = user ? JSON.parse(user) : null;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userData?.id || '0'
        },
        body: JSON.stringify({
          query: query,
          user_id: userData?.id || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Ошибка поиска');
        setLoading(false);
        return;
      }

      setSearchResult(data);
      
      if (data.count === 0) {
        toast.info('Ничего не найдено', {
          description: 'Попробуйте изменить запрос'
        });
      } else {
        toast.success(`Найдено: ${data.count} позиций`);
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-border bg-dark-lighter/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold via-gold-light to-silver rounded-lg flex items-center justify-center pulse-gold">
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
                onClick={() => navigate('/dashboard')}
              >
                <Icon name="Briefcase" className="w-4 h-4 mr-2" />
                Рабочий стол
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center gold-glow">
                <Icon name="Search" className="w-8 h-8 text-dark" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gold">Интеллектуальный поиск</h2>
                <p className="text-silver">AI понимает запросы на естественном языке</p>
              </div>
            </div>
          </div>

          <Card className="bg-dark-lighter border-gold/20 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Icon name="Bot" className="w-6 h-6" />
                Спросите AI
              </CardTitle>
              <CardDescription className="text-silver">
                Опишите, что вы ищете обычными словами
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Например: Найди швеллер 14П в Казани дешевле 90 000 ₽"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-dark border-gold/20 focus:border-gold text-foreground text-lg"
                />
                <Button
                  className="bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale px-8"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                      Ищу...
                    </>
                  ) : (
                    <>
                      <Icon name="Search" className="w-5 h-5 mr-2" />
                      Найти
                    </>
                  )}
                </Button>
              </div>

              <div>
                <p className="text-sm text-silver mb-2">Популярные запросы:</p>
                <div className="flex flex-wrap gap-2">
                  {popularQueries.map((pq, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10 text-xs"
                      onClick={() => setQuery(pq)}
                    >
                      {pq}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {searchResult && (
            <div className="space-y-6 animate-fade-in">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Анализ запроса</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {searchResult.parsed.product && (
                      <div className="p-3 bg-dark rounded-lg border border-gold/10">
                        <p className="text-sm text-silver mb-1">Товар:</p>
                        <p className="text-foreground font-medium">{searchResult.parsed.product}</p>
                      </div>
                    )}
                    {searchResult.parsed.city && (
                      <div className="p-3 bg-dark rounded-lg border border-gold/10">
                        <p className="text-sm text-silver mb-1">Город:</p>
                        <p className="text-foreground font-medium">{searchResult.parsed.city}</p>
                      </div>
                    )}
                    {searchResult.parsed.max_price && (
                      <div className="p-3 bg-dark rounded-lg border border-gold/10">
                        <p className="text-sm text-silver mb-1">Макс. цена:</p>
                        <p className="text-gold font-bold">{searchResult.parsed.max_price.toLocaleString()} ₽</p>
                      </div>
                    )}
                    <div className="p-3 bg-dark rounded-lg border border-green-500/20">
                      <p className="text-sm text-silver mb-1">Найдено:</p>
                      <p className="text-green-500 font-bold">{searchResult.count} позиций</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Результаты поиска</CardTitle>
                  <CardDescription className="text-silver">
                    {searchResult.count} {searchResult.count === 1 ? 'позиция' : 'позиций'} по вашему запросу
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {searchResult.results.map((product) => (
                    <Card key={product.id} className="bg-dark border-gold/10 hover-scale">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-foreground mb-2">
                              {product.name}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                              <div>
                                <span className="text-silver">Цена:</span>{' '}
                                <span className="text-gold font-bold">
                                  {product.price.toLocaleString('ru-RU')} ₽/{product.unit}
                                </span>
                              </div>
                              <div>
                                <span className="text-silver">Остаток:</span>{' '}
                                <span className="text-foreground font-medium">
                                  {product.quantity.toLocaleString('ru-RU')} {product.unit}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="MapPin" className="w-4 h-4 text-gold" />
                                <span className="text-foreground">{product.city}</span>
                              </div>
                            </div>
                            <div className="p-3 bg-dark-lighter rounded-lg border border-gold/20">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gold mb-1">
                                    {product.company_name}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-silver">
                                    <span className="flex items-center gap-1">
                                      <Icon name="Phone" className="w-3 h-3" />
                                      {product.phone}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Icon name="Mail" className="w-3 h-3" />
                                      {product.email}
                                    </span>
                                  </div>
                                </div>
                                <Badge className="bg-gold/20 text-gold border-gold/30">
                                  <Icon name="Star" className="w-3 h-3 mr-1" />
                                  {product.rating.toFixed(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AISearch;
