
sets
         i index of component /1*100/
         j index of group /1*5/
         t1 /1*200/
         t(t1) index of period/19*49/
                           ;

parameters
         C(i)    Cost of component
         CC(i)   Cost of replacing component
         CR(i)   Cost of repairing component
         CGSU(j) Cost of setup
         LMP(i)  Last period for component i
         N(i)    Number of reaparing after replacing for component i
         ETM(i)  Time for maintenancing of component i
         RUL(i)  Remain usefull life for each componet(LSTM)
         G(i,j);
*From Excel to GAMS  ***********************************************************

$call GDXXRW data_input_100.xlsx  par=C  rng=C!a1   Rdim=1 cdim=0 par=CC  rng=CC!a1   Rdim=1 cdim=0 par=CR  rng=CR!a1   Rdim=1 cdim=0 par=CGSU  rng=CGSU!a1   Rdim=1 cdim=0 par=LMP  rng=LMP!a1   Rdim=1 cdim=0 par=N  rng=N!a1   Rdim=1 cdim=0 par=ETM  rng=ETM!a1   Rdim=1 cdim=0 par=RUL  rng=RUL!a1   Rdim=1 cdim=0 par=G  rng=G!a1   Rdim=1 Cdim=1
$GDXIN data_input_100.gdx
$LOAD C, CC, CR, CGSU, LMP, N, ETM, RUL, G
$GDXIN

scalars
         M       big Number     /10000/
         CDT     Cost of stop each period /8000/
         Now     Cureent date /21/;


variables
         Z  ;
binary variables
         XP(i,t1), R(i), RN(i), H(i), D(j,t),  K(j,t), F(i,j,t);
positive variable
          MP(i) , Q(j,t), S(i);



Equations
*test
         ObjectiveFunction
         co1(i)
         co2(i)
         co3(i)
         co5(i,t1)
         co6(i,t1)
         co7(i)
         co8(i)
         co9(i)
         co10(t,j)
         co11(t,j)
         co12(t,j)
         co13(i)
         co14(i)
         co15(i)
         co16
         co17
         co18
co19
co20
co21
co22
co23
;

*test.. z =g= 0;


ObjectiveFunction ..         z =e=     sum(i,((C(i)+CC(i))*RN(i)) + ((CR(i)) * R(i))+ ((ETM(i)/C(i)) * (RUL(i)* H(i) - S(i) + Now * H(i)) + (((MP(i) - Now - RUL(i)) * CDT) - ( S(i) - H(i) * Now - H(i)* RUL(i)) * CDT)))
                                    +  sum((j,t), CGSU(j) * D(j,t))
                                    -  sum((j,t), CGSU(j) * ( Q(j,t) - D(j,t))) ;

co1(i)            ..       R(i) + RN(i) =e= 1 ;
co2(i)            ..       Now =l= MP(i)    ;
co3(i)            ..       MP(i) =l= (LMP(i) + 2 * ETM(i))    ;
co5(i,t1)$t(t1)   ..       MP(i) =g= ord(t1) - M * ( 1 - XP(i,t1)) ;
co6(i,t1)$t(t1)   ..       MP(i) =l= ord(t1) + M * ( 1 - XP(i,t1)) ;
co7(i)            ..       sum(t, XP(i,t)) =e= R(i) + RN(i) ;
co8(i)            ..       MP(i) - Now - RUL(i) - 1 =g= (-M) * H(i);
co9(i)            ..       MP(i) - Now - RUL(i)     =l=   M * (1-H(i));
co10(t,j)         ..       sum(i, XP(i,t) * G(i,j)) =g= D(j,t);
co11(t,j)         ..       sum(i, XP(i,t) * G(i,j)) =l= M * D(j,t);
co12(t,j)         ..       sum(i, XP(i,t) * G(i,j)) =e= K(j,t);
co13(i)           ..       S(i) =l= H(i) * M;
co14(i)           ..       S(i) =l= MP(i) + M * (1-H(i));
co15(i)           ..       S(i) =g= MP(i) - M * (1-H(i)) ;
co16(j,t)         ..      q(j,t) =g= K(j,t) - (1 - D(j,t)) * M;
co17(j,t)         ..      q(j,t) =l= K(j,t) + (1 - D(j,t)) * M;
co18(j,t)         ..      q(j,t) =l= K(j,t) * M;
co19(i,j,t)       ..      F(i,j,t) =l= (XP(i,t) + G(i,j))/2;
co20(i,j,t)       ..      F(i,j,t) =g= (XP(i,t) + G(i,j) - 1)/2;
co21(j,t)         ..      sum(i, F(i,j,t)) =g= D(j,t);
co22(j,t)         ..      sum(i, F(i,j,t)) =l= D(j,t) * M;
co23(j,t)         ..      sum(i, F(i,j,t)) =e= K(j,t);

option limrow=100,limcol=100;
model Maintenance_model
/
*test
ObjectiveFunction
co1
co2
co3
co5
co6
co7
co8
co9
co10
co11
co12
co13
co14
co15
co16
co17
co18
co19
co20
co21
co22
co23
/;
option optca=1 , optcr=1;
solve Maintenance_model minimizing z using mip  ;

Display RUL, C, Z.l, MP.l, XP.l, R.l, RN.l, H.l, D.l, K.l, Q.l;
