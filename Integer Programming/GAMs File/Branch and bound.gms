set i/1*2/;
set j/1*3/;
table m(j,i)
   1   2
1  7  -2
2  0   1
3  2  -2
;
parameter c(i)
          /1 4
           2 -1/;
parameter b(j)
          /1 14
           2 3
           3 5/;
scalar
maxx / 10 /
minx / 0.5/
;

variables
x(i)
z
;
integer variable x(i);
equations
         objective             Objective Function
         constraint(j)         all     Constraint

;
         objective..      z=e=sum(i,c(i)*x(i));
         constraint(j)..  sum(i,m(j,i)*x(i))=l=b(j);
model plan /all/

*///////////////////////////// B & B /////////////////////////*
set node 'maximum size of the node pool' /node1*node1000/;
parameter bound(node) 'node n will have an obj <= bound(n)';
set fixed(node,i) 'variables x(i) are fixed to zero in this node';
set lowerbound(node,i) 'variables x(i)>=minx in this node';
scalar bestfound 'lowerbound in B&B tree' /-INF/;
scalar bestpossible 'upperbound in B&B tree' /+INF/;
set newnode(node) 'new node (singleton)';
set waiting(node) 'waiting node list';
set current(node) 'current node (singleton except exceptions)';
parameter log(node,*) 'logging information';
scalar done 'terminate' /0/;
scalar first 'controller for loop';
scalar first2 'controller for loop';
scalar obj 'objective of subproblem';
scalar maxx;
set w(node);
parameter nodenumber(node);
nodenumber(node) = ord(node);
fixed(node,i) = no;
lowerbound(node,i) = no;
set h(i);
alias (n,node);
waiting('node1') = yes;
current('node1') = yes;
newnode('node1') = yes;
bound('node1') =INF;
loop(node$(not done),
bestpossible = smax(waiting(n), bound(n));
current(n) = no;
current(waiting(n))$(bound(n) = bestpossible) = yes;
first = 1;
loop(current$first,
first = 0;
log(node,'node') = nodenumber(current);
log(node,'ub') = bestpossible;
waiting(current) = no;
x.lo(i) = 0;
x.up(i) = maxx;
h(i) = lowerbound(current,i);
x.lo(h) = minx;
h(i) = fixed(current,i);
x.up(h) = 0;
solve plan maximizing z using mip;
log(node,'solvestat') = plan.solvestat;
log(node,'modelstat') = plan.modelstat;
abort$(plan.solvestat <> 1) "Solver did not return ok";
if (plan.modelstat = 1 or plan.modelstat = 2,
obj = z.l;
log(node,'obj') = obj;
maxx = smax(i, min(x.l(i), max(minx-x.l(i),0)));
if (maxx = 0,
log(node,'integer') = 1;
if (obj > bestfound,
log(node,'best') = 1;
bestfound = obj;
w(n) = no; w(waiting) = yes;
waiting(w)$(bound(w) < bestfound) = no;
);
else
h(i) = no;
h(i)$(min(x.l(i), max(minx-x.l(i),0))=maxx) = yes;
first2 = 1;
loop(j$first2,
first2 = 0;
newnode(n) = newnode(n-1);
fixed(newnode,i) = fixed(current,i);
lowerbound(newnode,i) = lowerbound(newnode,i);
bound(newnode) = obj;
waiting(newnode) = yes;
fixed(newnode,i) = yes;
newnode(n) = newnode(n-1);
fixed(newnode,i) = fixed(current,i);
lowerbound(newnode,i) = lowerbound(newnode,i);
bound(newnode) = obj;
waiting(newnode) = yes;
lowerbound(newnode,i) = yes;
);
);
else
abort$(plan.modelstat <> 4 and plan.modelstat <> 5) "Solver did not solve subproblem";
);
log(node,'waiting') = card(waiting);
);
done$(card(waiting) = 0) = 1;
display log,x.l;

);
