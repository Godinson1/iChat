## Steps to configuring Google Virtual Machine instance

- Create a free instance
- Generate ssh key using putty Key Gen (Give it a username in the comment session)
- Copy formated key at top of window and paste in the ssh section in gc console either after or during registration

## SOLVED - Permission denied public key

- ssh into your server from the google console
  click on ssh and run the below command

- sudo apt update
- sudo nano /etc/ssh/sshd_config
  scroll to the bottom of the file and effect the below changes

- Change from
  PermitRootLogin prohibit-password
- To
  PermitRootLogin yes

- Change from
  PasswordAuthentication no
- To
  PasswordAuthentication yes

Save the file and run the below

sudo service ssh restart or sudo service sshd reload

Try connecton to your instance again from putty with the public ip and user when creating your ssh key
