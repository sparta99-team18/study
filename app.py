import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, session, redirect, request, jsonify

from functools import wraps
import pymongo

app = Flask(__name__)
app.secret_key = b'\xcc^\x91\xea\x17-\xd0W\x03\xa7\xf8J0\xac8\xc5'

# 몽고디비계정연결
from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.9cihgwo.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

#버킷
@app.route("/bucket", methods=["POST"])
def bucket_post():
    bucket_receive = request.form['bucket_give']

    bucket_list = list(db.bucket.find({}, {'_id': False}))
    count = len(bucket_list) + 1
    doc = {
        'num': count,
        'bucket': bucket_receive,
        'done': 0
    }

    db.bucket.insert_one(doc)

    return jsonify({'msg': 'POST(기록) 연결 완료!'})


@app.route("/bucket/done", methods=["POST"])
def bucket_done():
    num_receive = request.form['num_give']
    db.bucket.update_one({'num': int(num_receive)}, {'$set': {'done': 1}})
    return jsonify({'msg': '버킷완료!'})


@app.route("/bucket", methods=["GET"])
def bucket_get():
    bucket_list = list(db.bucket.find({}, {'_id': False}))
    return jsonify({'buckets': bucket_list})

# Decorators
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/')

    return wrap


# Routes
from user import routes


@app.route('/')
def home():
    return render_template('home2.html')


@app.route('/home')
def home2():
    return render_template('home.html')


@app.route('/dashboard/csshtml/')
def csshtml():
    return render_template('csshtml.html')


@app.route('/dashboard/')
@login_required
def dashboard():
    return render_template('dashboard.html')


@app.route('/dashboard/javascript/')
def javascript():
    return render_template('javascript.html')


@app.route('/dashboard/dashboard/')
def python():
    return render_template('dashboard.html')


@app.route('/dashboard/react/')
def react():
    return render_template('react.html')


@app.route('/dashboard/database/')
def database():
    return render_template('database.html')

@app.route('/dashboard/bucket/')
def bucket():
    return render_template('bucket.html')

# pyythonthema
# 파이썬테마피디아
@app.route('/main')
def main():
    return render_template('pythonthema.html')


# 파이썬테마 - POST요청
# ajax POST 방식으로 /pythonthema 경로로 ,
# data{url_give: url, star_give:star, comment_give:comment }를 받는다.
@app.route("/pythonthema", methods=["POST"])
def pythonthema_post():  # pythonthema_post() 함수 실행 // count = len(pythonthema_list) + 1 추가
    url_receive = request.form['url_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    title = soup.select_one('meta[property="og:title"]')['content']
    image = soup.select_one('meta[property="og:image"]')['content']
    desc = soup.select_one('meta[property="og:description"]')['content']
    pythonthema_list = list(db.pythonthema.find({}, {'_id': False}))
    count = len(pythonthema_list) + 1
    # print(count)
    doc = {  # dac안에 title, image, desc, star, comment값을 넣는다.
        'num': count,
        'title': title,
        'image': image,
        'desc': desc,
        'star': star_receive,
        'comment': comment_receive
    }
    db.pythonthema.insert_one(doc)  # doc에 담긴것을db에  insert 한다.

    return jsonify({'msg': '저장 완료!'})  # 저장완료 메시지를 노출함


# pythonthema 기록하기 - GET요청
@app.route("/pythonthema", methods=["GET"])
def pythonthema_get():
    pythonthema_list = list(db.pythonthema.find({}, {'_id': False}))
    return jsonify({'pythonthema': pythonthema_list})


# pythonthema 수정 GET요청 API 구성
@app.route("/open/edit", methods=["GET"])
def edit_get():
    num_receive = request.args.get('num_give')
    pythonthema_list = list(db.pythonthema.find({'num': int(num_receive)}, {'_id': False}))
    print(pythonthema_list)
    return jsonify({'pythonthema': pythonthema_list})


# pythonthema - 수정 POST요청, title, 별점, 코멘트 데이터 수정용 POST API 구성
@app.route("/save/edit", methods=["POST"])
def edit_post():
    num_receive = request.form['num_give']
    url_receive = request.form['url_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']
    db.pythonthema.update_one({'num': int(num_receive)},
                              {'$set': {'url': url_receive, 'star': star_receive, 'comment': comment_receive}})
    return jsonify({'msg': '수정 완료!'})


# pythonthema - 삭제 요청 API 구성
@app.route("/delete", methods=["POST"])
def delete_post():
    num_receive = request.form['num_give'];
    db.pythonthema.delete_one({'num': int(num_receive)})
    print(num_receive)  # num값이 들어오는것을 확인
    return jsonify({'msg': '삭제 완료!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)