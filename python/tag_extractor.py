	
# coding: utf-8

# In[173]:


import pandas as p
import re
import glob
import os
from collections import Counter
import math;
import sys
import operator
import collections 
from operator import itemgetter
from heapq import nlargest


# In[217]:


path = os.getcwd();
def readIDFscore():
    filename = path+'/'+"IDF-score"
    dict = {};
    with open(filename, errors = 'ignore') as f:
        for line in f:
            s = re.sub(' +', '', line).strip().split('\t');
            if(len(s[0]) > 3 or float(s[1]) < 5):
                dict[s[0]] = s[1];
    return dict;


# In[218]:


dict = readIDFscore();
#path = "/media/tarun/Local Disk/Study/Sem6/SEN/"
articles = 20000;


# In[219]:


def computeTF(filename):
    data = [];
    n = 0;
    with open(path+'/'+filename, errors = 'ignore') as f:
        for line in f:
            s = re.sub(' +', ' ', line).split(' ');
            for i in s:
                i = re.sub(r'[^a-zA-Z0-9 ]',r'',i)
                data.append(i.lower());
                n = n+1;
    count = Counter(data);
    for word in count:
        count[word] = count[word]/n;
    return count;


# print(computeTF('1'));
# 

# In[220]:


article_count = computeTF('test');


# In[221]:


def TFIDF(dict, count):
    tfidf = {};
    for word in count:
        if word in dict.keys() and float(dict[word])!= 0:
          #  print(word, ' ', dict[word]);
            tfidf[word] = count[word] *(float(dict[word]));
    return tfidf;  


# In[222]:


tfidf_score = TFIDF(dict, article_count);
tags = nlargest(10, tfidf_score, key=tfidf_score.get)


# In[223]:


print(tags);

