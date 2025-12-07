import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from openai import OpenAI

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    AI-поиск поставщиков по естественному языку
    Args: query (str) - запрос пользователя, user_id (int) - ID пользователя
    Returns: список поставщиков и товаров с AI-анализом запроса
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    query = body_data.get('query', '')
    user_id = body_data.get('user_id')
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Query is required'}),
            'isBase64Encoded': False
        }
    
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    
    try:
        response = client.chat.completions.create(
            model='gpt-4',
            messages=[
                {
                    'role': 'system',
                    'content': '''Ты - AI-ассистент для поиска металлопроката. 
                    Извлекай из запроса: название товара, город, максимальную цену, минимальное количество.
                    Верни JSON: {"product": "...", "city": "...", "max_price": число или null, "min_quantity": число или null, "category": "..."}'''
                },
                {'role': 'user', 'content': query}
            ],
            temperature=0.3
        )
        
        parsed = json.loads(response.choices[0].message.content)
    except Exception:
        parsed = {'product': query, 'city': None, 'max_price': None, 'min_quantity': None}
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    sql = '''
        SELECT p.*, s.company_name, s.city as supplier_city, s.phone, s.email, s.rating
        FROM products p
        JOIN suppliers s ON p.supplier_id = s.id
        WHERE 1=1
    '''
    params = []
    
    if parsed.get('product'):
        sql += " AND p.name ILIKE %s"
        params.append(f"%{parsed['product']}%")
    
    if parsed.get('city'):
        sql += " AND (p.city ILIKE %s OR s.city ILIKE %s)"
        params.append(f"%{parsed['city']}%")
        params.append(f"%{parsed['city']}%")
    
    if parsed.get('max_price'):
        sql += " AND p.price <= %s"
        params.append(parsed['max_price'])
    
    sql += " ORDER BY p.price ASC LIMIT 50"
    
    cursor.execute(sql, params)
    results = cursor.fetchall()
    
    if user_id:
        cursor.execute(
            "INSERT INTO search_queries (user_id, query, results_count) VALUES (%s, %s, %s)",
            (user_id, query, len(results))
        )
        conn.commit()
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'query': query,
            'parsed': parsed,
            'results': [dict(r) for r in results],
            'count': len(results)
        }, default=str),
        'isBase64Encoded': False
    }
