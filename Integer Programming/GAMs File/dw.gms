sets
i ’origins’ /GARY, CLEV, PITT /
j ’destinations’ /FRA, DET, LAN, WIN, STL, FRE, LAF /
p ’products’ /bands, coils, plate/
;
table supply(p,i)
      GARY CLEV PITT
bands 400  700  800
coils 800  1600 1800
plate 200  300  300
;
table demand(p,j)
      FRA DET LAN WIN STL FRE LAF
bands 300 300 100 75  650 225 250
coils 500 750 400 250 950 850 500
plate 100 100 0   50  200 100 250
;
parameter limit(i,j);
limit(i,j) = 625;
table cost(p,i,j) ’unit cost’
           FRA DET LAN WIN STL FRE LAF
BANDS.GARY 30  10  8   10  11  71  6
BANDS.CLEV 22  7   10  7   21  82  13
BANDS.PITT 19  11  12  10  25  83  15
COILS.GARY 39  14  11  14  16  82  8
COILS.CLEV 27  9   12  9   26  95  17
COILS.PITT 24  14  17  13  28  99  20
PLATE.GARY 41  15  12  16  17  86  8
PLATE.CLEV 29  9   13  9   28  99  18
PLATE.PITT 26  14  17  13  31  104 20
;
*-----------------------------------------------------------------------
* direct LP formulation
*-----------------------------------------------------------------------
positive variable
x(i,j,p) ’shipments’
;
variable
z ’objective variable’
;
equations
obj
supplyc(i,p)
demandc(j,p)
limitc(i,j)
;
obj.. z =e= sum((i,j,p), cost(p,i,j)*x(i,j,p));
supplyc(i,p).. sum(j, x(i,j,p)) =e= supply(p,i);
demandc(j,p).. sum(i, x(i,j,p)) =e= demand(p,j);
limitc(i,j).. sum(p, x(i,j,p)) =l= limit(i,j);
model m/all/;
solve m minimizing z using lp;
*-----------------------------------------------------------------------
* subproblems
*-----------------------------------------------------------------------
positive variables xsub(i,j);
variables zsub;
parameters
s(i) ’supply’
d(j) ’demand’
c(i,j) ’cost coefficients’
pi1(i,j) ’dual of limit’
pi2(p) ’dual of convexity constraint’
pi2p
;
equations
supply_sub(i) ’supply equation for single product’
demand_sub(j) ’demand equation for single product’
rc1_sub ’phase 1 objective’
rc2_sub ’phase 2 objective’
;
supply_sub(i).. sum(j, xsub(i,j)) =e= s(i);
demand_sub(j).. sum(i, xsub(i,j)) =e= d(j);
rc1_sub.. zsub =e= sum((i,j), -pi1(i,j)*xsub(i,j)) - pi2p;
rc2_sub.. zsub =e= sum((i,j), (c(i,j)-pi1(i,j))*xsub(i,j)) - pi2p;
model sub1 ’phase 1 subproblem’ /supply_sub, demand_sub, rc1_sub/;
model sub2 ’phase 2 subproblem’ /supply_sub, demand_sub, rc2_sub/;
*-----------------------------------------------------------------------
* master problem
*-----------------------------------------------------------------------
set k ’proposal count’ /proposal1*proposal1000/;
set pk(p,k);
pk(p,k) = no;
parameter proposal(i,j,p,k);
parameter proposalcost(p,k);
proposal(i,j,p,k) = 0;
proposalcost(p,k) = 0;
positive variables
lambda(p,k)
excess ’artificial variable’
;
variable zmaster;
equations
obj1_master ’phase 1 objective’
obj2_master ’phase 2 objective’
limit_master(i,j)
convex_master
;
obj1_master.. zmaster =e= excess;
obj2_master.. zmaster =e= sum(pk, proposalcost(pk)*lambda(pk));
limit_master(i,j)..
sum(pk, proposal(i,j,pk)*lambda(pk)) =l= limit(i,j) + excess;
convex_master(p).. sum(pk(p,k), lambda(p,k)) =e= 1;
model master1 ’phase 1 master’ /obj1_master, limit_master, convex_master/;
model master2 ’phase 2 master’ /obj2_master, limit_master, convex_master/;
*-----------------------------------------------------------------------
* options to reduce solver output
*-----------------------------------------------------------------------
option limrow=0;
option limcol=0;
master1.solprint = 2;
master2.solprint = 2;
sub1.solprint = 2;
sub2.solprint = 2;
*-----------------------------------------------------------------------
* options to speed up solver execution
*-----------------------------------------------------------------------
master1.solvelink = 2;
master2.solvelink = 2;
sub1.solvelink = 2;
sub2.solvelink = 2;
*-----------------------------------------------------------------------
* DANTZIG-WOLFE INITIALIZATION PHASE
* test subproblems for feasibility
* create initial set of proposals
*-----------------------------------------------------------------------
display "-----------------------------------------------------------------",
"INITIALIZATION PHASE",
"-----------------------------------------------------------------";
set kk(k) ’current proposal’;
kk('proposal1') = yes;
loop(p,
*
* solve subproblem, check feasibility
*
c(i,j) = cost(p,i,j);
s(i) = supply(p,i);
d(j) = demand(p,j);
pi1(i,j) = 0;
pi2p = 0;
solve sub2 using lp minimizing zsub;
abort$(sub2.modelstat = 4) "SUBPROBLEM IS INFEASIBLE: ORIGINAL MODEL IS INFEASIBLE";
abort$(sub2.modelstat <> 1) "SUBPROBLEM NOT SOLVED TO OPTIMALITY";
*
* proposal generation
*
proposal(i,j,p,kk) = xsub.l(i,j);
proposalcost(p,kk) = sum((i,j), c(i,j)*xsub.l(i,j));
pk(p,kk) = yes;
kk(k) = kk(k-1);
);
option proposal:2:2:2;
display proposal;
*-----------------------------------------------------------------------
* DANTZIG-WOLFE ALGORITHM
* while (true) do
* solve restricted master
* solve subproblems
* until no more proposals
*-----------------------------------------------------------------------
set iter ’maximum iterations’ /iter1*iter15/;
scalar done /0/;
scalar count /0/;
scalar phase /1/;
scalar iteration;
loop(iter$(not done),
iteration = ord(iter);
display "-----------------------------------------------------------------",
iteration,
"-----------------------------------------------------------------";
*
* solve master problem to get duals
*
if (phase=1,
solve master1 minimizing zmaster using lp;
abort$(master1.modelstat <> 1) "MASTERPROBLEM NOT SOLVED TO OPTIMALITY";
if (excess.l < 0.0001,
display "Switching to phase 2";
phase = 2;
excess.fx = 0;
);
);
if (phase=2,
solve master2 minimizing zmaster using lp;
abort$(master2.modelstat <> 1) "MASTERPROBLEM NOT SOLVED TO OPTIMALITY";
);
pi1(i,j) = limit_master.m(i,j);
pi2(p) = convex_master.m(p);
count = 0;
loop(p$(not done),
*
* solve each subproblem
*
c(i,j) = cost(p,i,j);
s(i) = supply(p,i);
d(j) = demand(p,j);
pi2p = pi2(p);
if (phase=1,
solve sub1 using lp minimizing zsub;
abort$(sub1.modelstat = 4) "SUBPROBLEM IS INFEASIBLE: ORIGINAL MODEL IS INFEASIBLE";
abort$(sub1.modelstat <> 1) "SUBPROBLEM NOT SOLVED TO OPTIMALITY";
else
solve sub2 using lp minimizing zsub;
abort$(sub2.modelstat = 4) "SUBPROBLEM IS INFEASIBLE: ORIGINAL MODEL IS INFEASIBLE";
abort$(sub2.modelstat <> 1) "SUBPROBLEM NOT SOLVED TO OPTIMALITY";
);
*
* proposal
*
if (zsub.l < -0.0001,
count = count + 1;
display "new proposal", count,xsub.l;
proposal(i,j,p,kk) = xsub.l(i,j);
proposalcost(p,kk) = sum((i,j), c(i,j)*xsub.l(i,j));
pk(p,kk) = yes;
kk(k) = kk(k-1);
);
);
*
* no new proposals?
*
abort$(count = 0 and phase = 1) "PROBLEM IS INFEASIBLE";
done$(count = 0 and phase = 2) = 1;
);
abort$(not done) "Out of iterations";
*-----------------------------------------------------------------------
* recover solution
*-----------------------------------------------------------------------
parameter xsol(i,j,p);
xsol(i,j,p) = sum(pk(p,k), proposal(i,j,pk)*lambda.l(pk));
display xsol;
parameter totalcost;
totalcost = sum((i,j,p), cost(p,i,j)*xsol(i,j,p));
display totalcost;
