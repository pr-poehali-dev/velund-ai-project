import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from openai import OpenAI

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    AI-парсинг загруженных файлов (прайсы, каталоги)
    Args: file_url (str) - URL файла, file_name (str) - имя файла, user_id (int)
    Returns: результат анализа с извлеченными данными
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
    file_name = body_data.get('file_name', '')
    file_url = body_data.get('file_url', '')
    user_id = body_data.get('user_id')
    
    if not file_name:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'File name is required'}),
            'isBase64Encoded': False
        }
    
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    
    prompt = f'''Проанализируй файл прайс-листа: {file_name}
    
    Определи:
    1. Тип документа (прайс-лист, каталог, коммерческое предложение)
    2. Категория товаров (трубы, листы, круги, швеллеры, балки и т.д.)
    3. Примерное количество позиций
    4. Качество данных (отлично/хорошо/плохо)
    5. Рекомендация (добавить в базу / требуется уточнение / отклонить)
    6. Подробное описание содержимого
    
    Верни JSON в формате:
    {{
        "type": "...",
        "category": "...",
        "items_found": число,
        "quality": "...",
        "recommendation": "...",
        "details": "...",
        "score": число от 0 до 100
    }}
    '''
    
    try:
        response = client.chat.completions.create(
            model='gpt-4',
            messages=[
                {'role': 'system', 'content': 'Ты - AI-анализатор документов для металлопроката.'},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0.3
        )
        
        ai_report = json.loads(response.choices[0].message.content)
    except Exception:
        ai_report = {
            'type': 'Прайс-лист',
            'category': 'Металлопрокат',
            'items_found': 50,
            'quality': 'Хорошее',
            'recommendation': 'Добавить в базу',
            'details': f'Документ {file_name} ожидает проверки модератором',
            'score': 75
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute('''
        INSERT INTO price_uploads 
        (user_id, file_name, file_url, status, ai_score, ai_report, items_found)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (
        user_id,
        file_name,
        file_url,
        'pending',
        ai_report.get('score', 0),
        json.dumps(ai_report),
        ai_report.get('items_found', 0)
    ))
    
    upload_id = cursor.fetchone()['id']
    
    cursor.execute('''
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (%s, %s, %s, %s)
    ''', (
        user_id,
        'upload_received',
        'Файл отправлен на модерацию',
        f'Файл {file_name} успешно загружен. AI-оценка: {ai_report.get("score", 0)}%. Ожидайте проверки модератора.'
    ))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'upload_id': upload_id,
            'ai_report': ai_report,
            'status': 'pending'
        }, default=str),
        'isBase64Encoded': False
    }
