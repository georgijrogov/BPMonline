namespace Terrasoft.Configuration.IteLessonDurationService
{
	using System;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Core;
	using Terrasoft.Web.Common;
	using Terrasoft.Core.Entities; 

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class IteLessonDurationService: BaseService
	{
		[OperationContract]
		[WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
		ResponseFormat = WebMessageFormat.Json)]
		public string GetDuration(string iteProgramId) {
			var result = "";
			TimeSpan overallDuration = new TimeSpan(0, 0, 0);
			
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "IteSwimmingProgram");
			var colProgramId = esq.AddColumn("Id");
			var colLessonDuration = esq.AddColumn("[IteSwimmingLesson:IteProgram:Id].IteDuration");
			
			var esqFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "Id", iteProgramId);
			esq.Filters.Add(esqFilter);
			
			var entities = esq.GetEntityCollection(UserConnection);
			
			if (entities.Count > 0)
			{
				foreach(var entity in entities){
					overallDuration = overallDuration + TimeSpan.Parse(entity.GetColumnValue(colLessonDuration.Name).ToString());
				}
				result = overallDuration.ToString();
			}
			else
			{
				result = "-1";
			}
			
			return result;
		}
	}
}