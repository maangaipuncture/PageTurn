def inter(l1,l2):
    i=0
    j=0
    intersect = []
    while(i<len(l1) and j<len(l2)):
        if(l1[i]>l2[j]):
            j=j+1
        elif(l1[i]<l2[j]):
            i=i+1
        else:
            if (l1[i] not in intersect) or l1[i] != intersect[-1]:
                intersect.append(l1[i])
            i=i+1
            j=j+1
    return intersect    

l1=[1,2,3,3,4,5,6]     
l2=[2,3,3,5,6,6,7]     
print(inter(l1,l2),"hi")

