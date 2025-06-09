from django.test import TestCase
from . import models

# hpbb = models.HP.objects.filter(loai='Bắt buộc', hocky=2, manganh = 'TM22')
# lhp_unique = models.LHP.objects.order_by('mahp').distinct('mahp')
# lhp = models.LHP.objects.all()
# print('testcase 1: ' + str(lhp_unique.count()))
# for i in lhp_unique:
#     print(i.mahp.mahp)
# print('testcase 2: ' + str(hpbb.count()))
# for i in hpbb:
#     print(i.mahp, i.tenhp, i.sotc, i.loai, i.hocky, i.manganh)
a = 0
# for i in hpbb:
#     for j in lhp_unique:
#         if i.mahp == j.mahp.mahp:
#             a += 1
#             print(i.mahp)
# print('testcase 3: ' +  str(a))

lhp = models.LHP.objects.order_by('malhp')
hp = models.HP.objects.order_by('tenhp')
lhp_hp = []
for i in hp:
    for j in lhp:
        if i.mahp == j.mahp.mahp:
            lhp_hp.append({
                'lhp': j,
                'hp': i
            })
print('testcase 4: ' + str(len(lhp_hp)))