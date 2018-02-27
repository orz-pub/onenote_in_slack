using System;
using Microsoft.Win32;

namespace OnenoteLinker
{
    class Program
	{
		static string ProcessInput(string s)
		{
			// TODO Verify and validate the input 
			// string as appropriate for your application.
			return s;
		}

        static void Main(string[] args)
		{
            try
            {
                Console.WriteLine("Raw command-line: \n\t" + Environment.CommandLine);
                Console.WriteLine("\n\nArguments:\n");
                foreach (string s in args)
                {
                    Console.WriteLine("\t" + ProcessInput(s));
                }

                if (args.Length > 0)
                {
                    var onenoteLinkPath = args[0];
                    onenoteLinkPath = Uri.UnescapeDataString(args[0].Replace("onenotelinker:///", "onenote:///")).Replace(" ", "%20");
                    Console.WriteLine($"\nLinkPath:\n {onenoteLinkPath}");

                    var regKey = Registry.ClassesRoot.OpenSubKey(@"onenote\Shell\open\Command");
                    var command = regKey.GetValue(null).ToString() ;
                    Console.WriteLine($"command: {command}");

                    var execFileName = command.Substring(0, command.IndexOf(" /hyperlink "));
                    Console.WriteLine($"execFileName: {execFileName}");

                    System.Diagnostics.Process.Start(execFileName, $"/hyperlink {onenoteLinkPath}");
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

#if DEBUG
            Console.WriteLine("\nPress any key to continue...");
            Console.ReadKey();
#endif
        }
    }
}
