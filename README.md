### Escuela Colombiana de Ingeniería
### Arquitecturas de Software - ARSW

## Escalamiento en Azure con Maquinas Virtuales, Sacale Sets y Service Plans

### Dependencias
* Cree una cuenta gratuita dentro de Azure. Para hacerlo puede guiarse de esta [documentación](https://azure.microsoft.com/es-es/free/students/). Al hacerlo usted contará con $100 USD para gastar durante 12 meses.

### Parte 0 - Entendiendo el escenario de calidad

Adjunto a este laboratorio usted podrá encontrar una aplicación totalmente desarrollada que tiene como objetivo calcular el enésimo valor de la secuencia de Fibonnaci.

**Escalabilidad**
Cuando un conjunto de usuarios consulta un enésimo número (superior a 1000000) de la secuencia de Fibonacci de forma concurrente y el sistema se encuentra bajo condiciones normales de operación, todas las peticiones deben ser respondidas y el consumo de CPU del sistema no puede superar el 70%.

### Parte 1 - Escalabilidad vertical

1. Diríjase a el [Portal de Azure](https://portal.azure.com/) y a continuación cree una maquina virtual con las características básicas descritas en la imágen 1 y que corresponden a las siguientes:
    * Resource Group = SCALABILITY_LAB
    * Virtual machine name = VERTICAL-SCALABILITY
    * Image = Ubuntu Server 
    * Size = Standard B1ls
    * Username = scalability_lab
    * SSH publi key = Su llave ssh publica

![Imágen 1](images/part1/part1-vm-basic-config.png)

2. Para conectarse a la VM use el siguiente comando, donde las `x` las debe remplazar por la IP de su propia VM (Revise la sección "Connect" de la virtual machine creada para tener una guía más detallada).

    `ssh scalability_lab@xxx.xxx.xxx.xxx`

   ![Connection](images/part1/connection.png)

3. Instale node, para ello siga la sección *Installing Node.js and npm using NVM* que encontrará en este [enlace](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/).

   ![NodeJs](images/part1/installNode1.png)
   ![NodeJs](images/part1/installNode2.png)
   ![NodeJs](images/part1/installNode3.png)
4. Para instalar la aplicación adjunta al Laboratorio, suba la carpeta `FibonacciApp` a un repositorio al cual tenga acceso y ejecute estos comandos dentro de la VM:

    `git clone <your_repo>`

    `cd <your_repo>/FibonacciApp`

    `npm install`

   ![NodeJs](images/part1/installFibo.png)

5. Para ejecutar la aplicación puede usar el comando `npm FibinacciApp.js`, sin embargo una vez pierda la conexión ssh la aplicación dejará de funcionar. Para evitar ese compartamiento usaremos *forever*. Ejecute los siguientes comando dentro de la VM.

    ` node FibonacciApp.js`

   ![NodeJs](images/part1/foreverFibo.png)

6. Antes de verificar si el endpoint funciona, en Azure vaya a la sección de *Networking* y cree una *Inbound port rule* tal como se muestra en la imágen. Para verificar que la aplicación funciona, use un browser y user el endpoint `http://xxx.xxx.xxx.xxx:3000/fibonacci/6`. La respuesta debe ser `The answer is 8`.

![](images/part1/part1-vm-3000InboudRule.png)

   ![Endpoint](images/part1/testEndpoint.png)

7. La función que calcula en enésimo número de la secuencia de Fibonacci está muy mal construido y consume bastante CPU para obtener la respuesta. Usando la consola del Browser documente los tiempos de respuesta para dicho endpoint usando los siguintes valores:
    * 1000000
      ![Endpoint](images/part1/test1.png)

    * 1010000
      ![Endpoint](images/part1/test2.png)

    * 1020000
      ![Endpoint](images/part1/test3.png)

    * 1030000
      ![Endpoint](images/part1/test4.png)

    * 1040000
      ![Endpoint](images/part1/test5.png)

    * 1050000
      ![Endpoint](images/part1/test6.png)

    * 1060000
      ![Endpoint](images/part1/test7.png)

    * 1070000
      ![Endpoint](images/part1/test8.png)

    * 1080000
      ![Endpoint](images/part1/test9.png)

    * 1090000    
      ![Endpoint](images/part1/test10.png)


8. Dírijase ahora a Azure y verifique el consumo de CPU para la VM. (Los resultados pueden tardar 5 minutos en aparecer).

![Imágen 2](images/part1/part1-vm-cpu.png)

![Metricas](images/part1/metricas.png)


9. Ahora usaremos Postman para simular una carga concurrente a nuestro sistema. Siga estos pasos.
    * Instale newman con el comando `npm install newman -g`. Para conocer más de Newman consulte el siguiente [enlace](https://learning.getpostman.com/docs/postman/collection-runs/command-line-integration-with-newman/).
    * Diríjase hasta la ruta `FibonacciApp/postman` en una maquina diferente a la VM.
    * Para el archivo `[ARSW_LOAD-BALANCING_AZURE].postman_environment.json` cambie el valor del parámetro `VM1` para que coincida con la IP de su VM.
    * Ejecute el siguiente comando.

    ```
    newman run ARSW_LOAD-BALANCING_AZURE.postman_collection.json -e [ARSW_LOAD-BALANCING_AZURE].postman_environment.json -n 10 &
    newman run ARSW_LOAD-BALANCING_AZURE.postman_collection.json -e [ARSW_LOAD-BALANCING_AZURE].postman_environment.json -n 10
    ```

   ![newman](images/part1/newman1.png)
   ![newman](images/part1/newman2.png)




10. La cantidad de CPU consumida es bastante grande y un conjunto considerable de peticiones concurrentes pueden hacer fallar nuestro servicio. Para solucionarlo usaremos una estrategia de Escalamiento Vertical. En Azure diríjase a la sección *size* y a continuación seleccione el tamaño `B2ms`.

![Imágen 3](images/part1/part1-vm-resize.png)

11. Una vez el cambio se vea reflejado, repita el paso 7, 8 y 9.

* 1000000
 ![Endpoint](images/part1/test2_1.png)
* 1010000
  ![Endpoint](images/part1/test2_2.png)
* 1020000
  ![Endpoint](images/part1/test2_3.png)
* 1030000
  ![Endpoint](images/part1/test2_4.png)
* 1040000
  ![Endpoint](images/part1/test2_5.png)
* 1050000
  ![Endpoint](images/part1/test2_6.png)
* 1060000
  ![Endpoint](images/part1/test2_7.png)
* 1070000
  ![Endpoint](images/part1/test2_8.png)
* 1080000
  ![Endpoint](images/part1/test2_9.png)
* 1090000
  ![Endpoint](images/part1/test2_10.png)

* **Métricas**
  ![metricas](images/part1/metricas2.png)

* **Newman**
  ![newman](images/part1/newman2_1.png)
  ![newman](images/part1/newman2_2.png)


12. Evalue el escenario de calidad asociado al requerimiento no funcional de escalabilidad y concluya si usando este modelo de escalabilidad logramos cumplirlo.
   
   Al realizar la escalabilidad vertical si se cumple con el escenario de calidad propuesto, ya que al aumentar las 
   especificaciones de la VM, las respuestas de las solicitudes son mejores y se aprovecha de mejor manera la CPU.

13. Vuelva a dejar la VM en el tamaño inicial para evitar cobros adicionales.

**Preguntas**

1. ¿Cuántos y cuáles recursos crea Azure junto con la VM?
   * Virtual network/subnet
   * Public IP address
   * Network security group
   * Network Interface
   * OS disk 
2. ¿Brevemente describa para qué sirve cada recurso?
   * **Virtual network/subnet**
   Similar a una red tradicional, permite la comunicación entre diferentes recursos Azure como lo
   pueden ser las máquinas virtuales, usuarios, internet o demás redes locales de manera segura. VNet
   aporta las ventajas adicionales de la infraestrucutra de Azure como la escalabilidad, la disponibilidad 
   y el aislamiento. 
   
   * **Public IP address**
   Permite que los recursos de Azure se comuniquen con Internet y los servicios públicos de Azure. Las direcciones
   son asignadas de manera dinámica por Azure. 
   
   * **Network security group**
   Se utiliza a modo de filtro de red desde y para los recursos de Azure en una red virtual de Azure. Se basa principalmente
   en un conjunto de reglas de seguridad que permiten o niegan el tráfico de red entrante o red saliente. Cada regla debe tener
   especificado origen, destino, puerto y protocolo. 

   * **Network Interface**
   Componente que permite la comunicación entre las máquinas virtuales de Azure con Internet y demás recursos de Azure.   

   * **OS disk**
   Almacenamiento del OS de la máquina virtual creada. 
   
3. ¿Al cerrar la conexión ssh con la VM, por qué se cae la aplicación que ejecutamos con el comando `npm FibonacciApp.js`? ¿Por qué debemos crear un *Inbound port rule* antes de acceder al servicio?
   Al correr el comando, el proceso será asociado al usuario que realizó la acción, si el usaurio cierra la conexión, se cerrará el proceso. Al iniciar la máquina, la mayoría de puertos se encontrarán cerrados,
   por cuestiones de seguridad, el servicio está ligado a un puerto de ejecución, se debe abrir el puerto de la máquina virtual para que sea posible la conexión a dicho puerto. 

4. Adjunte tabla de tiempos e interprete por qué la función tarda tanto tiempo.

   | N | B1ls(s) | B2s(s)|
   | ------ | ------ | ------ |
   | 1000000 | 23.58 | 18.32 |
   | 1010000 | 24.06 | 19.84 |
   | 1020000 | 24.51 | 20.27 |
   | 1030000 | 25.03 | 20.62 |
   | 1040000 | 25.57 | 20.84 |
   | 1050000 | 26.06 | 21.20 |
   | 1060000 | 26.70 | 21.72 |
   | 1070000 | 27.14 | 22.32 |
   | 1080000 | 27.63 | 22.67 |
   | 1090000 | 28.20 | 23.23 |

   La secuencia de Fibonacci consume muchos recursos para que pueda ser calculada, al tener una máquina con menos recursos, se tomará 
   más tiempo para realizar el calculo, mientras que con una máquina un poco más robusta, los tiempos de espera son menores.

5. Adjunte imágen del consumo de CPU de la VM e interprete por qué la función consume esa cantidad de CPU.
   ![metricas](images/part1/metricas2.png)

   La secuencia de Fibonacci realiza varios cálculos redundantes, es  por eso que con cada petición el consumo de CPU es grande. Una posible
   solución es utilizar algún método de memorización que permita guardar los cálculos anteriormente realizados y que al calcular un número elevado
   no sea necesario realizar todo el cálculo, sino reutilizar los resultados anteriormente obtenidos.

6. Adjunte la imagen del resumen de la ejecución de Postman. Interprete:
    * Tiempos de ejecución de cada petición.
      ![resume](images/part1/resumePostman.png)
   El tiempo promedio de cada petición fue de _17.7s_. El aproximado de datos recibidos fue de _2.09MB_ 
  * Si hubo fallos documentelos y explique.
   No hubo fallos en la ejecución. 
7. ¿Cuál es la diferencia entre los tamaños `B2ms` y `B1ls` (no solo busque especificaciones de infraestructura)?

   | Instancia | Núcleos | RAM | Almacenamiento temporal | Pago por uso |
   | ------ | ------ | ------ |------ |------ |
   | B1ls | 1 | 0.5 GiB | 2 GiB | $0,0052/hora |
   | B2ms | 2 | 2 GiB | 16 GiB | $0,0832/hora |   

   Ambos tamaños se usan principalmente para desarrollo o pruebas por lo que el tráfico de datos que manejan es bajo/medio
   

8. ¿Aumentar el tamaño de la VM es una buena solución en este escenario?, ¿Qué pasa con la FibonacciApp cuando cambiamos el tamaño de la VM?
   Aumentar el tamaño se podría considerar como una solución temporal al problema, porque aunque al aumentar el tamaño de la máquina se ve una disminución 
   de uso de recursos, se debería plantear una solución a largo plazo, una solución en la cual se eviten cálculos redundantes mediante la memorización de 
   resultados anteriores, logrando asi disminuir aún más los tiempos de respuesta. 

9. ¿Qué pasa con la infraestructura cuando cambia el tamaño de la VM? ¿Qué efectos negativos implica?
   Al hacer el cambio de tamaño, la máquina necesita reiniciarse lo que hace que la conexión **SSH** se caiga y sea necesario realizarla nuevamente, ademas de que 
   si no se guarda la IP, es posible que Azure la cambie. El reinicio de la máquina implica un reinicio del servidor web lo que implica que las peticiones realizadas 
   en ese lapso de tiempo no logren ser atendidas. 

10. ¿Hubo mejora en el consumo de CPU o en los tiempos de respuesta? Si/No ¿Por qué?
   Sí, con el nuevo tamaño la máquina virtual dispone de más recursos para realizar cálculos 
   y atender peticiones. 

11. Aumente la cantidad de ejecuciones paralelas del comando de postman a `4`. ¿El comportamiento del sistema es porcentualmente mejor?

* Informe petición 1
  ![request](images/part1/request1.png)

* Informe petición 2
  ![request](images/part1/request2.png)

* Informe petición 3
  ![request](images/part1/request3.png)

* Informe petición 4
  ![request](images/part1/request4.png)


El comportamiento del sistema no mejoró. 
### Parte 2 - Escalabilidad horizontal

#### Crear el Balanceador de Carga

Antes de continuar puede eliminar el grupo de recursos anterior para evitar gastos adicionales y realizar la actividad en un grupo de recursos totalmente limpio.

1. El Balanceador de Carga es un recurso fundamental para habilitar la escalabilidad horizontal de nuestro sistema, por eso en este paso cree un balanceador de carga dentro de Azure tal cual como se muestra en la imágen adjunta.

![](images/part2/part2-lb-create.png)

2. A continuación cree un *Backend Pool*, guiese con la siguiente imágen.

![](images/part2/part2-lb-bp-create.png)

3. A continuación cree un *Health Probe*, guiese con la siguiente imágen.

![](images/part2/part2-lb-hp-create.png)

4. A continuación cree un *Load Balancing Rule*, guiese con la siguiente imágen.

![](images/part2/part2-lb-lbr-create.png)

5. Cree una *Virtual Network* dentro del grupo de recursos, guiese con la siguiente imágen.

![](images/part2/part2-vn-create.png)

#### Crear las maquinas virtuales (Nodos)

Ahora vamos a crear 3 VMs (VM1, VM2 y VM3) con direcciones IP públicas standar en 3 diferentes zonas de disponibilidad. Después las agregaremos al balanceador de carga.

1. En la configuración básica de la VM guíese por la siguiente imágen. Es importante que se fije en la "Avaiability Zone", donde la VM1 será 1, la VM2 será 2 y la VM3 será 3.

![](images/part2/part2-vm-create1.png)

2. En la configuración de networking, verifique que se ha seleccionado la *Virtual Network*  y la *Subnet* creadas anteriormente. Adicionalmente asigne una IP pública y no olvide habilitar la redundancia de zona.

![](images/part2/part2-vm-create2.png)

3. Para el Network Security Group seleccione "avanzado" y realice la siguiente configuración. No olvide crear un *Inbound Rule*, en el cual habilite el tráfico por el puerto 3000. Cuando cree la VM2 y la VM3, no necesita volver a crear el *Network Security Group*, sino que puede seleccionar el anteriormente creado.

![](images/part2/part2-vm-create3.png)

4. Ahora asignaremos esta VM a nuestro balanceador de carga, para ello siga la configuración de la siguiente imágen.

![](images/part2/part2-vm-create4.png)

5. Finalmente debemos instalar la aplicación de Fibonacci en la VM. para ello puede ejecutar el conjunto de los siguientes comandos, cambiando el nombre de la VM por el correcto

```
git clone https://github.com/daprieto1/ARSW_LOAD-BALANCING_AZURE.git

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
source /home/vm1/.bashrc
nvm install node

cd ARSW_LOAD-BALANCING_AZURE/FibonacciApp
npm install

npm install forever -g
forever start FibonacciApp.js
```

Realice este proceso para las 3 VMs, por ahora lo haremos a mano una por una, sin embargo es importante que usted sepa que existen herramientas para aumatizar este proceso, entre ellas encontramos Azure Resource Manager, OsDisk Images, Terraform con Vagrant y Paker, Puppet, Ansible entre otras.

![](images/part2/machines.png)

#### Probar el resultado final de nuestra infraestructura

1. Por supuesto el endpoint de acceso a nuestro sistema será la IP pública del balanceador de carga, primero verifiquemos que los servicios básicos están funcionando, consuma los siguientes recursos:

```
http://52.155.223.248/
http://52.155.223.248/fibonacci/1
```

![](images/part2/frontEndOK.png)

2. Realice las pruebas de carga con `newman` que se realizaron en la parte 1 y haga un informe comparativo donde contraste: tiempos de respuesta, cantidad de peticiones respondidas con éxito, costos de las 2 infraestrucruras, es decir, la que desarrollamos con balanceo de carga horizontal y la que se hizo con una máquina virtual escalada.
![](images/part2/newman.png)

3. Agregue una 4 máquina virtual y realice las pruebas de newman, pero esta vez no lance 2 peticiones en paralelo, sino que incrementelo a 4. Haga un informe donde presente el comportamiento de la CPU de las 4 VM y explique porque la tasa de éxito de las peticiones aumento con este estilo de escalabilidad.

```
newman run ARSW_LOAD-BALANCING_AZURE.postman_collection.json -e [ARSW_LOAD-BALANCING_AZURE].postman_environment.json -n 10 &
newman run ARSW_LOAD-BALANCING_AZURE.postman_collection.json -e [ARSW_LOAD-BALANCING_AZURE].postman_environment.json -n 10 &
newman run ARSW_LOAD-BALANCING_AZURE.postman_collection.json -e [ARSW_LOAD-BALANCING_AZURE].postman_environment.json -n 10 &
newman run ARSW_LOAD-BALANCING_AZURE.postman_collection.json -e [ARSW_LOAD-BALANCING_AZURE].postman_environment.json -n 10
```

**Preguntas**

* ¿Cuáles son los tipos de balanceadores de carga en Azure y en qué se diferencian?, ¿Qué es SKU, qué tipos hay y en qué se diferencian?, ¿Por qué el balanceador de carga necesita una IP pública?
* ¿Cuál es el propósito del *Backend Pool*?
* ¿Cuál es el propósito del *Health Probe*?
* ¿Cuál es el propósito de la *Load Balancing Rule*? ¿Qué tipos de sesión persistente existen, por qué esto es importante y cómo puede afectar la escalabilidad del sistema?.
* ¿Qué es una *Virtual Network*? ¿Qué es una *Subnet*? ¿Para qué sirven los *address space* y *address range*?
* ¿Qué son las *Availability Zone* y por qué seleccionamos 3 diferentes zonas?. ¿Qué significa que una IP sea *zone-redundant*?
* ¿Cuál es el propósito del *Network Security Group*?
* Informe de newman 1 (Punto 2)
* Presente el Diagrama de Despliegue de la solución.




