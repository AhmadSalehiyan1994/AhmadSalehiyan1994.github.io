sets
k nodes  /0*10/
p(k) demand nodes /2,4,5/
i(k) damaged nodes  /0,6*10/
e arcs /a,b,c,d,e,f,g,h,i,j,k,l,m,n/
iter  max benders iteration/iter1*iter10/
dyniter(iter) dynamics subset;
set ei(k,e) arcs incident to node k  /0.(a,b,c,d),1.(d,f,g),2.(e,f),3.(c,g,h,i),4.(h,n),5.(k,l,m),6.(a,e),7.(b,l),8.(i,j),9.(j,k),10.(m,n)/;
alias(i,j,r)

parameters
d(p) demand of node p /2 5,4 4,5 3/
s(i) repair time of node i  /0 0,6 1,7 2,8 1,9 2,10 2/
t(e) travel time on arc e /a 1,b 1,c 3,d 3,e 2,f 3,g 3,h 3,i 1,j 1,k 1,l 2,m 2,n 1/
l(e) length(distance) of arc e /a 1,b 1,c 3,d 3,e 2,f 3,g 3,h 3,i 1,j 1,k 1,l 2,m 2,n 1/
Ml(p) maximum distance allowed between the depot and the demand node p  /2 6,4 6,5 9/
M a sufficiently large number /100000/
cutconst(iter)
cutcoeff(iter,i,j);

*----**master problem**
Variable zmaster;
Positive Variables
omega    objective function of masterproblem
RR(k)     for eliminating subtours
tetha(p) exact time of demand node to become accessible;
Binary variable
x(i,j)   if node j is repaired immediately after node i;
Free variable
tethat;

equations
masterobj
st1(i)
st2(j)
q1(i,j)
q2
optcut(iter);

masterobj..zmaster=e=omega+tethat;
st1(i)..                                     sum(j$(ord(i)<>ord(j)),x(i,j))=e=1;
st2(j)..                                     sum(i$(ord(i)<>ord(j)),x(i,j))=e=1;
q1(i,j)$((j.val Ne 0) and (i.val Ne j.val))..RR(j)=g=RR(i)+1-6*(1-x(i,j));
q2..                                         omega=g=sum(p,d(p)*tetha(p));

optcut(dyniter)..tethat=g=cutconst(dyniter)+sum((i,j),cutcoeff(dyniter,i,j));

model masterproblem /masterobj,st1,st2,q1,q2,optcut/;

*----*subproblem1**

Binary Variables
U(e,i,j) if arc e is used on the path from node i to node j
N(k,i,j) if node k is used on the path from node i to node j;
Positive Variable
zr Exact time at which the damaged node i is repaired;
Free variable
zsub1 objective function of subproblem1;

equations
subobj1
st5(i,j,k)
st11(i,j,r)
q3(i,j)
q4(i,j)
q5(i,j);

subobj1..zsub1=e=sum(i,zr(i));
st5(i,j,k)$(ord(j)<>0 and (i.val Ne k.val) and (j.val Ne k.val) and (i.val Ne j.val)).. sum(ei(k,e),u(e,i,j))=e=2*n(k,i,j);
st11(i,j,r)$((j.val Ne 0) and (r.val Ne 0) and (i.val Ne j.val) and (j.val Ne r.val))..zr(j)=g=zr(r)+(n(r,i,j)-1)*M;
q3(i,j)$((ord(j)<>0) and ord(i)<>ord(j) )..   sum(ei(i,e),U(e,i,j))=e=x.l(i,j);
q4(i,j)$((ord(j)<>0) and ord(i)<>ord(j) )..   sum(ei(j,e),U(e,i,j))=e=x.l(i,j);
q5(i,j)$((j.val Ne 0) and (i.val Ne j.val)).. zr(j)=g=zr(i)+sum(e,U(e,i,j)*t(e))+s(j)-(1-x.l(i,j))*M;

model subproblem1 /subobj1,st5,st11,q3,q4,q5/;

*----*subproblem2**

Binary Variables
Y(e,p) if arc e is used on the path from supply node 0 to node p
V(k,p) if node k is used on the path from supply node 0 to node p;
Positive Variable
zd Exact time at which the demand node p becomes accessible;
Free variable
zsub2 objective function of subproblem1;

equations
subobj2
st6(p)
st7(p)
st8(p,k)
st9(p)
q6(p,j);

subobj2..zsub2=e=sum(p,d(p)*zd(p));
st6(p)$(ord(p)<>0)..                           sum(ei("0",e),y(e,p))=e=1;
st7(p)$(ord(p)<>0)..                           sum(ei(p,e),y(e,p))=e=1;
st8(p,k)$((k.val Ne 0) and (p.val Ne k.val)).. sum(ei(k,e),y(e,p))=e=2*v(k,p);
st9(p)..                                       sum(e,(y(e,p)*l(e)))=l=ml(p);
q6(p,j)$(ord(j)<>0)..                          zd(p)=g=zr.l(j)+(v(j,p)-1)*M;

model subproblem2 /subobj2,st6,st7,st8,st9,q6/;

*------*Benders algorithm*--------
*step1
display "master problem without cut step1";
dyniter (iter)=no;
cutconst(iter)=0;
cutcoeff(iter,i,j)=0;

solve masterproblem minimizing zmaster using MIP;
display omega.l;

scalar lowerbound /-INF/;
scalar upperbound /INF/;
parameter objsub;
scalar objmaster;
objmaster=zmaster.l;
scalar iteration;
scalar done/0/;
loop(iter$(not done),
iteration=ord(iter);
*---solve subproblems*---
dyniter (iter)=yes;
cutconst(iter)=0;
cutcoeff(iter,i,j)=0;
solve subproblem1 minimizing zsub1 using MIP;
solve subproblem2 minimizing zsub2 using MIP;
objsub=zsub1.l+zsub2.l;

cutconst(iter)=sum((i,j,k),st5.m(i,j,k)*2*N.l(k,i,j))+sum((i,j,r),st11.m(i,j,r)*(zr.l(r)+(N.l(r,i,j)-1)*M))+sum(p,st6.m(p))+sum(p,st7.m(p))+sum((p,k),st8.m(p,k)*2*v.l(k,p))+sum(p,st9.m(p)*ml(p))+sum((p,j),q6.m(p,j)*(zr.l(j)+(v.l(j,p)-1)*M))+sum((i,j),q5.m(i,j)*(zr.l(i)+sum(e,u.l(e,i,j)*t(e))+s(j)));
cutcoeff(iter,i,j)=q4.m(i,j)*x.l(i,j)+q3.m(i,j)*x.l(i,j)+q5.m(i,j)*(x.l(i,j)-1)*M;

display cutconst,cutcoeff;
upperbound=min(upperbound,objmaster+objsub);

*convergence test
display upperbound,lowerbound;
if(upperbound-lowerbound<0.1*(1+abs(lowerbound)),
display "converged";
display omega.l;
done=1;

else
solve masterproblem minimizing zmaster using MIP;
lowerbound=zmaster.l;
objmaster=zmaster.l-tethat.l;
);

display omega.l,iteration,lowerbound,upperbound,zmaster.l,objmaster,zsub1.l,zsub2.l,x.l,u.l,n.l,zr.l,zd.l,y.l,v.l;
);
execute_unload 'AA';
abort$(not done) "too many iteration";





