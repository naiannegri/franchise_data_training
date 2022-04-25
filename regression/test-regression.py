import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns
import math, warnings
from sklearn import linear_model
from sklearn.neighbors import NearestNeighbors
import pandas as pd
import seaborn as sn

df_train = pd.read_csv("dataWorkstyle-training.csv") 
df_test = pd.read_csv("dataWorkstyle-test.csv") 

X = df_train[['sector','investmentStart','returnTime','workStyle','companySize','faturamentoMedio','capitalInstalacao','taxaFranquia','capital_needed','prazo']]
y = df_train['company'] 

X_norm =(X-X.mean())/X.std()

model = linear_model.RidgeClassifier().fit(X_norm, y)
result = model.score(X_norm, y)



print(result)

X_test = df_test[['sector','investmentStart','returnTime','workStyle','companySize','faturamentoMedio','capitalInstalacao','taxaFranquia','capital_needed','prazo']]
X_test_norm =(X_test-X_test.mean())/X_test.std()

y_test = model.predict(X_test_norm)

print(y_test)

# print(y_test)

# X1 = df_userInput[['workStyle','sector','investmentStart','returnTime','faturamentoMedio','capitalInstalacao']]

# correlation = df.corr()
# plot = sn.heatmap(correlation, annot = True, fmt=".1f", linewidths=.6)
# plt.show()

# ##keywords
# set_keywords = set()
# for liste_keywords in df['Description'].str.split(' ').values:
#     if isinstance(liste_keywords, float): continue  # only happen if liste_keywords = NaN
#     set_keywords = set_keywords.union(liste_keywords)
#    # print(set_keywords)

# set_keywords_perfil = set()
# for liste_keywords in df['perfilFranqueado'].str.split(' ').values:
#     if isinstance(liste_keywords, float): continue  # only happen if liste_keywords = NaN
#     set_keywords_perfil = set_keywords_perfil.union(liste_keywords)

# #set_keywords.remove('')

# ##count keywords
# def count_word(df, ref_col, liste):
#     keyword_count = dict()
#     for s in liste: keyword_count[s] = 0
#     for liste_keywords in df[ref_col].str.split(' '):        
#         if type(liste_keywords) == float and pd.isnull(liste_keywords): continue        
#         for s in [s for s in liste_keywords if s in liste]: 
#             if pd.notnull(s): keyword_count[s] += 1
#     #______________________________________________________________________
#     # convert the dictionary in a list to sort the keywords by frequency
#     keyword_occurences = []
#     for k,v in keyword_count.items():
#         keyword_occurences.append([k,v])
#     keyword_occurences.sort(key = lambda x:x[1], reverse = True)
#     return keyword_occurences, keyword_count



# keyword_occurences_description, dum = count_word(df, 'Description', set_keywords)
# keyword_occurences_perfil, dum = count_word(df, 'perfilFranqueado', set_keywords_perfil)
# keyword_occurences = keyword_occurences_description + keyword_occurences_perfil

# ##plota as palavras-chaves
# def random_color_func(word=None, font_size=None, position=None,
#                       orientation=None, font_path=None, random_state=None):
#     h = int(360.0 * tone / 255.0)
#     s = int(100.0 * 255.0 / 255.0)
#     l = int(100.0 * float(random_state.randint(70, 120)) / 255.0)
#     return "hsl({}, {}%, {}%)".format(h, s, l)
# fig = plt.figure(1, figsize=(18,13))
# words = dict()
# trunc_occurences = keyword_occurences[0:50]
# for s in trunc_occurences:
#     words[s[0]] = s[1]
# tone = 55.0 

# # histograma
# ax2 = fig.add_subplot(2,1,2)
# y_axis = [i[1] for i in trunc_occurences]
# x_axis = [k for k,i in enumerate(trunc_occurences)]
# x_label = [i[0] for i in trunc_occurences]
# plt.xticks(rotation=85, fontsize = 15)
# plt.yticks(fontsize = 15)
# plt.xticks(x_axis, x_label)
# plt.ylabel("Nb. of occurences", fontsize = 18, labelpad = 10)
# ax2.bar(x_axis, y_axis, align = 'center', color='g')
# #_______________________
# plt.title("Keywords",bbox={'facecolor':'k', 'pad':5},color='w',fontsize = 25)
# plt.show()


##missing values

# X1 = df_userInput
# ## y1=

# regr = RidgeClassifier().fit(X, y)
# regr.score(X, y)