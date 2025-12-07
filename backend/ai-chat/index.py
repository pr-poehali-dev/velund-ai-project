import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from openai import OpenAI

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    AI-чат консультант для вопросов о металлопрокате
    Args: message (str) - сообщение пользователя, user_id (int) - ID пользователя
    Returns: ответ AI с контекстом из базы данных
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
    message = body_data.get('message', '')
    user_id = body_data.get('user_id')
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute('''
        SELECT category, COUNT(*) as count, AVG(price) as avg_price
        FROM products
        GROUP BY category
        LIMIT 10
    ''')
    market_data = cursor.fetchall()
    
    cursor.execute('''
        SELECT city, COUNT(*) as suppliers_count
        FROM suppliers
        GROUP BY city
        ORDER BY suppliers_count DESC
        LIMIT 10
    ''')
    cities_data = cursor.fetchall()
    
    context = f"Статистика базы: {len(market_data)} категорий товаров. "
    context += f"Города: {', '.join([c['city'] for c in cities_data])}."
    
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    
    response = client.chat.completions.create(
        model='gpt-4',
        messages=[
            {
                'role': 'system',
                'content': f'''Ты - AI-консультант Velund AI для металлопроката. 
                Помогаешь с поиском, консультируешь по ГОСТам, рассчитываешь массу, подбираешь аналоги.
                Контекст базы данных: {context}
                Отвечай кратко и по делу. Если не знаешь точно - предложи найти в базе.'''
            },
            {'role': 'user', 'content': message}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    ai_response = response.choices[0].message.content
    
    if user_id:
        cursor.execute(
            "INSERT INTO chat_history (user_id, message, response, context) VALUES (%s, %s, %s, %s)",
            (user_id, message, ai_response, json.dumps({'market_data': [dict(m) for m in market_data]}, default=str))
        )
        conn.commit()
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'message': message,
            'response': ai_response,
            'timestamp': context.request_id
        }),
        'isBase64Encoded': False
    }
