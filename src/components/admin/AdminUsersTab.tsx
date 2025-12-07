import Icon from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUsersTab = () => {
  return (
    <Card className="bg-dark-lighter border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold">Управление пользователями</CardTitle>
        <CardDescription className="text-silver">
          Роли, подписки и статусы пользователей
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Icon name="Users" className="w-16 h-16 text-gold mx-auto mb-4" />
          <p className="text-silver">
            Раздел управления пользователями в разработке
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsersTab;
