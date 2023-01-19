package code;

import java.io.*;
import java.net.*;
//import java.util.*;

public class Client {
    Socket clientSocket;
    BufferedReader inFromServer;
    PrintWriter outToServer;
    boolean isAdmin;

    public static void main(String[] args) throws IOException {
        if(args.length < 2) {
            System.out.println("Please enter valid commands");
            System.exit(0);
        }
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        Client ob = new Client();
        ob.createClient(args[0], Integer.parseInt(args[1]));
        String x = "";
        for(int i = 2; i < args.length; i++)
            x+=args[i]+" ";

        while(true) {
            ob.sendToServer(x);
            ob.outputHandler(ob.recvFromServer());

            System.out.print("[USER " + ob.clientSocket.getLocalPort()+"] Enter command: ");
            x = br.readLine();
            if(x.equals("q")) {
                ob.sendToServer("q");
                break;
            }
        }
        ob.closeClient();
    }

    void createClient(String hostname, int portNo) throws IOException {
        clientSocket = new Socket(hostname, portNo);
        System.out.println("[USER "+clientSocket.getLocalPort()+"] Sucessfully connected.");
        inFromServer = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        outToServer = new PrintWriter(new OutputStreamWriter(clientSocket.getOutputStream()));
    }

    void sendToServer(String outputString) throws IOException {
        outToServer.println(outputString);
        outToServer.flush();
    }

    String recvFromServer() throws IOException {
        String recvString = inFromServer.readLine();
        return recvString;
    }

    void outputHandler(String recvString) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        // diplays all get output comma separated
        if(recvString.equals("")) return;
        if(recvString.charAt(recvString.length()-1) == ',') {
            String output[] = recvString.split(",");
            for(int i = 0; i < output.length; i++) {
                if(output[i].equals("null"))
                    System.out.println("\n");
                else
                    System.out.println(output[i]);
            }
        }

        // handles admin communiation
        if(recvString.equals("askpass")) {
            System.out.print("Enter passphrase: ");
            String pwd = br.readLine();
            sendToServer(pwd);
            if(recvFromServer().equals("authsucess")) {
                System.out.println("--MANAGER ACCESS GRANTED---");
                do {
                    System.out.println("\nWelcome manager. What do you want to do?\n1. Display all user data.\n2. Modify value for a user's key."
                                            +"\n0. to break\n");
                    String ch = br.readLine();
                    sendToServer(ch);
                    if(ch.equals("0")) break;
                    String reply = recvFromServer();
                    if(reply.equals("askval")) {
                        System.out.println("Enter user id, key and value separated by space: ");
                        sendToServer(br.readLine());
                        System.out.println(recvFromServer());
                        //System.out.println(recvFromServer());
                    }
                    else 
                        System.out.println("\n"+reply+"\n");
                } while(true);
            }
            else {
                System.out.println("--INCORRECT PASSWORD. ACCESS DENIED---"); return;
            }
            System.out.println("--EXITING MANAGER MODE--");
        }
    }

    void closeClient() throws IOException {
        clientSocket.close();
        inFromServer.close();
        outToServer.close();
    }
}
