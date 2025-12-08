import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление поставщиками (пользователи + админ-модерация)
    Args: GET/?admin=true - список на модерацию, GET - мои поставщики, POST - создать, PUT - модерировать, DELETE - удалить
    Returns: список поставщиков или результат операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        is_admin = params.get('admin') == 'true'
        
        if is_admin:
            cursor.execute('SELECT role FROM users WHERE id = %s', (user_id,))
            user = cursor.fetchone()
            if not user or user['role'] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Admin access required'}),
                    'isBase64Encoded': False
                }
        
        if method == 'GET' and is_admin:
            status_filter = params.get('status', 'pending')
            cursor.execute('''
                SELECT us.*, u.full_name as user_name, u.email as user_email
                FROM user_suppliers us
                JOIN users u ON us.user_id = u.id
                WHERE us.status = %s
                ORDER BY us.created_at DESC
            ''', (status_filter,))
            suppliers = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps([dict(s) for s in suppliers], default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            cursor.execute('''
                SELECT * FROM user_suppliers 
                WHERE user_id = %s 
                ORDER BY created_at DESC
            ''', (user_id,))
            suppliers = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps([dict(s) for s in suppliers], default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT' and is_admin:
            body_data = json.loads(event.get('body', '{}'))
            supplier_id = body_data.get('supplier_id')
            action = body_data.get('action')
            rejection_reason = body_data.get('rejection_reason')
            
            if not supplier_id or action not in ['approve', 'reject']:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Invalid request'}),
                    'isBase64Encoded': False
                }
            
            if action == 'approve':
                cursor.execute('SELECT * FROM user_suppliers WHERE id = %s', (supplier_id,))
                supplier_data = cursor.fetchone()
                
                if supplier_data:
                    cursor.execute('''
                        INSERT INTO suppliers 
                        (company_name, city, phone, email, rating, status, created_by_user_id, website_url)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ''', (
                        supplier_data['company_name'],
                        supplier_data['city'],
                        supplier_data['phone'],
                        supplier_data['email'],
                        5.0,
                        'approved',
                        supplier_data['user_id'],
                        supplier_data['website_url']
                    ))
                    
                    cursor.execute('''
                        UPDATE user_suppliers 
                        SET status = %s, moderated_at = CURRENT_TIMESTAMP, moderated_by = %s
                        WHERE id = %s
                    ''', ('approved', user_id, supplier_id))
                    
            elif action == 'reject':
                cursor.execute('''
                    UPDATE user_suppliers 
                    SET status = %s, moderated_at = CURRENT_TIMESTAMP, 
                        moderated_by = %s, rejection_reason = %s
                    WHERE id = %s
                ''', ('rejected', user_id, rejection_reason, supplier_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True, 'action': action}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            company_name = body_data.get('company_name')
            city = body_data.get('city')
            phone = body_data.get('phone')
            email = body_data.get('email')
            website_url = body_data.get('website_url')
            description = body_data.get('description')
            
            if not company_name:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Company name is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                INSERT INTO user_suppliers 
                (user_id, company_name, city, phone, email, website_url, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            ''', (user_id, company_name, city, phone, email, website_url, description))
            
            new_supplier = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps(dict(new_supplier), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            supplier_id = params.get('id')
            
            if not supplier_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Supplier ID is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                DELETE FROM user_suppliers 
                WHERE id = %s AND user_id = %s
            ''', (supplier_id, user_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()
