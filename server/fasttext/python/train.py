import fastText as ft
# train model
model = ft.train_supervised(input='./data.txt', epoch=25, lr=1.0)
# save model
model.save_model('../model/fasttext.bin')
#test model
test = model.test('./test.txt')


import requests as req
# send post request metric info
precision, recall = test[1], test[2]
print(precision, recall)

r = req.post('http://localhost:4000/metric', json={"precision": precision, "recall": recall, "model":"fasttext.bin"})
print(r.status_code, r.reason)

# init pubsub
r = req.post('http://localhost:4000/init')
print(r.status_code, r.reason)